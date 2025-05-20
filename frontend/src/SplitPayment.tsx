/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ethers, parseEther, formatEther } from "ethers";
import { SplitPaymentABI } from "./SplitPaymentABI";

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

const CONTRACT_ADDRESS = "0xB6D69619658e4e95Af64B0f3CA19C993dd89AD8a";

interface Payment {
  sender: string;
  timestamp: number;
  recipients: string[];
  amounts: string[];
}

export default function SplitPaymentApp() {
  const [recipients, setRecipients] = useState<string[]>([""]);
  const [amounts, setAmounts] = useState<string[]>([""]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Install MetaMask");
      const prov = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await prov.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, SplitPaymentABI, signer);
      setContract(contract);
    };
    init();
  }, []);

  const handleRecipientChange = (index: number, value: string) => {
    const copy = [...recipients];
    copy[index] = value;
    setRecipients(copy);
  };

  const handleAmountChange = (index: number, value: string) => {
    const copy = [...amounts];
    copy[index] = value;
    setAmounts(copy);
  };

  const addRecipientField = () => {
    setRecipients([...recipients, ""]);
    setAmounts([...amounts, ""]);
  };

  const validateInputs = () => {
    if (recipients.length !== amounts.length) {
      setError("Recipients and amounts count must match.");
      return false;
    }
    for (let i = 0; i < recipients.length; i++) {
      if (!ethers.isAddress(recipients[i])) {
        setError(`Invalid address at position ${i + 1}`);
        return false;
      }
      if (isNaN(Number(amounts[i])) || Number(amounts[i]) <= 0) {
        setError(`Invalid amount at position ${i + 1}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const sendPayment = async () => {
    if (!contract) return alert("Contract not initialized");
    if (!validateInputs()) return;
    try {
      setLoading(true);
      const parsedAmounts = amounts.map(a => parseEther(a));
      const total = parsedAmounts.reduce((acc, curr) => acc + curr, 0n);
      const tx = await contract.splitPayment(recipients, parsedAmounts, { value: total });
      await tx.wait();
      alert("Payment successful");
      setRecipients([""]);
      setAmounts([""]);
    } catch (err: any) {
      console.error("Payment error", err);
      setError(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const count = await contract.getPaymentsCount();
      const data: Payment[] = [];
      for (let i = 0; i < count; i++) {
        const p = await contract.getPayment(i);
        data.push({
          sender: p.sender,
          timestamp: Number(p.timestamp),
          recipients: p.recipients,
          amounts: p.amounts.map((a: any) => a.toString())
        });
      }
      setPayments(data);
    } catch (err: any) {
      console.error("Error loading history:", err);
      setError(err.message || "Error loading history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold text-center">Split Payment DApp</h2>

      {recipients.map((_, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Recipient address"
            value={recipients[idx]}
            onChange={e => handleRecipientChange(idx, e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Amount (ETH)"
            value={amounts[idx]}
            onChange={e => handleAmountChange(idx, e.target.value)}
            className="w-32 p-3 border border-gray-300 rounded-md"
          />
        </div>
      ))}

      <div className="flex gap-3 justify-between">
        <button
          onClick={addRecipientField}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Recipient
        </button>
        <button
          onClick={sendPayment}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          {loading ? "Sending..." : "Send Payment"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <hr className="my-6" />

      <button
        onClick={loadHistory}
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow w-full"
      >
        Load Payment History
      </button>

      <div className="mt-4 space-y-4">
        {payments.map((p, i) => (
          <div key={i} className="border border-gray-200 p-4 rounded-md bg-gray-50">
            <p><strong>Sender:</strong> {p.sender}</p>
            <p><strong>Time:</strong> {new Date(p.timestamp * 1000).toLocaleString()}</p>
            <p className="mt-2"><strong>Recipients:</strong></p>
            <ul className="list-disc pl-5">
              {p.recipients.map((r, idx) => (
                <li key={idx}>{r} - {formatEther(p.amounts[idx])} ETH</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}