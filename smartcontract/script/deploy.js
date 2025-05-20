async function main() {
  const SplitPayment = await ethers.getContractFactory("SplitPayment");
  const contract = await SplitPayment.deploy();
  await contract.waitForDeployment();
  console.log("Contract deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
