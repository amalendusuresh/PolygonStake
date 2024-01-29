async function main() {
  // Retrieve accounts from the Hardhat node
  const [deployer] = await ethers.getSigners();

  // Log the address of the deployer
  console.log("Deploying contracts with the account:", deployer.address);

  // Get contract factories
  const MyToken = await ethers.getContractFactory("MyToken");
  const PolygonStaking = await ethers.getContractFactory("PolygonStaking");
  const FlashLoanProvider = await ethers.getContractFactory("FlashLoanProvider");
  const MockFlashLoanReceiver = await ethers.getContractFactory("MockFlashLoanReceiver");


  // Deploy the MyToken contract
  const myTokenDeployment = await MyToken.deploy();
  await myTokenDeployment.waitForDeployment();
  const myTokenAddress = await myTokenDeployment.getAddress();

  console.log("MyToken deployed to:", myTokenAddress);

  // Pass the token's address to the PolygonStaking and FlashLoanProvider contracts
  const polygonStakingDeployment = await PolygonStaking.deploy(myTokenAddress, 86400); // Assuming a 24h delay for emergency withdrawal
  await polygonStakingDeployment.waitForDeployment();
  const polygonStakingAddress = await polygonStakingDeployment.getAddress();

  console.log("PolygonStaking deployed to:", polygonStakingAddress);

  const flashLoanProviderDeployment = await FlashLoanProvider.deploy(myTokenAddress);
  await flashLoanProviderDeployment.waitForDeployment();
  const flashLoanProviderAddress = await flashLoanProviderDeployment.getAddress();

  console.log("FlashLoanProvider deployed to:", flashLoanProviderAddress);

  const MockFlashLoanReceiverDeployment = await MockFlashLoanReceiver.deploy(flashLoanProviderAddress);
  await MockFlashLoanReceiverDeployment.waitForDeployment();
  const MockFlashLoanReceiverAddress = await MockFlashLoanReceiverDeployment.getAddress();

  console.log("MockFlashLoanReceiver deployed to:", MockFlashLoanReceiverAddress);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });