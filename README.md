## 💸 Split Fund

A decentralized application (DApp) that allows users to split ETH payments across multiple recipients in one secure transaction using a smart contract on the Ethereum blockchain. Built with React on the frontend and Solidity for the smart contract.

## 🚀 Features
- ✅ Split ETH between multiple recipients with specified amounts

- 📜 View a complete history of all payments sent via the smart contract

- 🔐 Secure interaction via MetaMask

- ⚡ Simple, clean, and responsive React UI

## 🧠 How It Works
1. Connect MetaMask to the DApp

2. Enter recipient wallet addresses and corresponding amounts in ETH

3. Click "Send Payment" to trigger the splitPayment function in the smart contract

3. View past transactions in the Payment History section

All transactions are recorded on-chain with details of the sender, recipients, amounts, and timestamp.

## 🛠️ Tech Stack
| Layer      | Technology         |
| ---------- | ------------------ |
| Frontend   | React + TypeScript |
| UI Styling | Tailwind CSS       |
| Blockchain | Solidity (v0.8.19) |
| Web3       | ethers.js (v6+)    |
| Wallet     | MetaMask           |

## 📦 Smart Contract
The core logic lives in the SplitPayment.sol contract, which:

- Takes in multiple recipient addresses and ETH amounts

- Validates the input and total ETH sent

- Transfers the specified amount to each recipient

- Logs the payment to a public payments array

- Emits a PaymentSent event

📁 Location: contracts/SplitPayment.sol
🧪 Deployed at: 0xB6D69619658e4e95Af64B0f3CA19C993dd89AD8a



## 🖥️ Frontend
The frontend is built using React with TypeScript and uses ethers.js to interact with the smart contract.

Key Functionalities:
Dynamic form to add multiple recipients and corresponding ETH amounts

Client-side validation for address format and amount

Displays history of previous payments by fetching from the contract

Uses MetaMask to sign and send transactions

📁 Entry File: SplitPaymentApp.tsx
📁 Contract ABI: SplitPaymentABI.ts

## 🧪 Running Locally
Prerequisites
Node.js v18+

MetaMask extension in your browser

Ethereum testnet ETH (if testing on a live network)

1.  Clone the repo
   ```
      git clone https://github.com/your-username/split-fund.git
     cd split-fund

   ```

2. Install dependencies
  ```
    npm install

  ```
3. start the development server
   ```
   npm run dev

   ```


## 🔐 Security Note
All payments are trustless and on-chain. However, make sure the addresses and ETH amounts entered are correct. Transactions cannot be reversed once submitted!

## 🧠 Future Improvements
- 💳 Support for ERC20 token splitting

- 🔍 Transaction filtering by wallet address

- 📊 Payment analytics dashboard

- 🧾 CSV export for history

- ✅ Unit tests for contract & frontend

## 🧑‍💻 Author
Ebrusike Favour
Twitter: @favebs
Web3 Dev | Technical Writer | Web3 Founder

