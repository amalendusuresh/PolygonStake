require('dotenv').config();
const { ethers } = require('ethers');
const prompts = require('prompts');

// Load ABIs from local files
const myTokenABIContent = require('./artifacts/contracts/Token.sol/MyToken.json'); 
const polygonStakingABIContent = require('./artifacts/contracts/Stake.sol/PolygonStaking.json');
const flashLoanProviderABIContent = require('./artifacts/contracts/Flashsale.sol/FlashLoanProvider.json');
const mockFlashLoanReceiverABIContent = require('./artifacts/contracts/FlashsaleReceiver.sol/MockFlashLoanReceiver.json');

console.log("0");

// Access the ABI from the JSON content
const myTokenABI = myTokenABIContent.abi;
console.log(Array.isArray(myTokenABI)); 
const polygonStakingABI = polygonStakingABIContent.abi;
const flashLoanProviderABI = flashLoanProviderABIContent.abi;
console.log(Array.isArray(flashLoanProviderABI)); 
console.log("1");
const mockFlashLoanReceiverABI = mockFlashLoanReceiverABIContent.abi;
console.log(Array.isArray(mockFlashLoanReceiverABI)); 
console.log("1");

// Define contract addresses
const myTokenAddress = '0x013c27638173Df3A1807603090e0AD199117Cf85'; 
const polygonStakingAddress = '0x188034A071E7D61E90ffa72223c888E91dB544D2'; 
const flashLoanProviderAddress = '0xf5d748D124F913479536F89188E99b2786e2D64b'; 
const mockFlashLoanReceiverAddress = '0x683d707352283d29D998DAa97C0cE15BCA978900';
console.log("2");
console.log("mockFlashLoanReceiverAddress", mockFlashLoanReceiverAddress)


// Set up a provider and signer
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log("3");

console.log(`FlashLoanProvider Address: ${flashLoanProviderAddress}`);
console.log(`MockFlashLoanReceiver Address: ${mockFlashLoanReceiverAddress}`);

// Connect your wallet to the contracts using the ABIs and contract addresses
const myToken = new ethers.Contract(myTokenAddress, myTokenABI, wallet);
const polygonStaking = new ethers.Contract(polygonStakingAddress, polygonStakingABI, wallet);
const flashLoanProvider = new ethers.Contract(flashLoanProviderAddress, flashLoanProviderABI, wallet);
const mockFlashLoanReceiver = new ethers.Contract(mockFlashLoanReceiverAddress, mockFlashLoanReceiverABI, wallet);
console.log("4");

console.log(`FlashLoanProvider Object's address: ${flashLoanProvider.target}`);
console.log(`MockFlashLoanReceiver Object's address: ${mockFlashLoanReceiver.target}`);

const main = async () => {
    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'Select an action',
        choices: [
            { title: 'Stake tokens', value: 'stake' },
            { title: 'Withdraw tokens', value: 'withdraw' },
            { title: 'Request flash loan', value: 'flashLoan' }
        ],
    });

    switch (response.action) {
        case 'stake':
            await stakeTokens();
            break;
        case 'withdraw':
            await withdrawTokens();
            break;
        case 'flashLoan':
            await requestFlashLoan();
            break;
        default:
            console.log('No action was selected!');
            break;
    }
};

const stakeTokens = async () => {
    const { amount } = await prompts({
        type: 'number',
        name: 'amount',
        message: 'How much would you like to stake (in tokens)?',
        validate: value => value > 0 ? true : 'Please enter a positive amount.'
    });

    // Parse the amount to the corresponding BigNumber format, taking care of token decimals
    const amountToStake = ethers.parseUnits(amount.toString(), 18);  // Replace 18 with the decimal place of MyToken if it's not 18

    console.log(`Preparing to stake ${amount} tokens...`);
    try {
        // Fetch the current allowance
        const currentAllowance = await myToken.allowance(wallet.address, polygonStakingAddress);

        // Check if the allowance is enough to cover the amount to stake
        if (currentAllowance.toString() < amountToStake.toString()) {
            // If not, approve the staking contract for the new amount
            console.log(`Approving the staking contract to spend tokens...`);
            const approvalTx = await myToken.approve(polygonStakingAddress, amountToStake);
            await approvalTx.wait();
            console.log(`${amount} tokens have been approved for staking.`);
        }
        
        // Proceed to stake the tokens now that we have the allowance
        console.log(`Staking ${amount} tokens...`);
        const stakingTx = await polygonStaking.stake(amountToStake);
        await stakingTx.wait();
        console.log(`Successfully staked ${amount} tokens.`);
    } catch (error) {
        console.error('Failed to stake tokens:', error);
    }
};

const withdrawTokens = async () => {
    const { amount } = await prompts({
        type: 'number',
        name: 'amount',
        message: 'How much would you like to withdraw (in ETH)?',
        validate: value => value > 0 ? true : 'Please enter a positive amount.'
    });

    console.log(`Attempting to withdraw ${amount} ETH...`);
    try {
        const tx = await polygonStaking.withdraw(ethers.parseEther(amount.toString()));
        await tx.wait();
        console.log(`Successfully withdrew ${amount} ETH!`);
    } catch (error) {
        console.error('Failed to withdraw tokens:', error);
    }
};


const requestFlashLoan = async () => {
    // Ask the user for the amount to flash borrow
    const response = await prompts({
        type: 'number',
        name: 'amount',
        message: 'How much would you like to borrow (in tokens)?',
        validate: value => value > 0 ? true : 'Please enter a positive amount.'
    });

    console.log("1");

    const amount = ethers.parseUnits(response.amount.toString(), 18); // Assuming 18 decimals

    try {
        // Validate if the provided contract addresses are valid Ethereum addresses
        if (!ethers.isAddress(flashLoanProviderAddress) || !ethers.isAddress(mockFlashLoanReceiverAddress)) {
            throw new Error('Invalid contract address(es).');
        }

        console.log("2");

        // Check if FlashLoanProvider contract has enough MyToken tokens to provide the loan
            const tokenBalance = await myToken.balanceOf(flashLoanProviderAddress);
                if (amount.toString() > tokenBalance.toString()) {
                throw new Error('FlashLoanProvider does not have enough tokens to provide the loan.');
        }
        console.log("tokenBalance", tokenBalance);
        console.log("3");
        

        // Call the flashLoan function on FlashLoanProvider contract
        const txResponse = await flashLoanProvider.flashLoan(
            amount,
            mockFlashLoanReceiverAddress
            
        );

        console.log("4");

        const receipt = await txResponse.wait();
        console.log(`Flash loan successful! Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error('Flash loan request failed:', error.message || error);

        // Decode revert reason from error.data if it's in ABI-encoded format
        if (error.data) {
            // Attempt to decode using the ABI of the flashLoanProvider
            const iface = new ethers.Interface(flashLoanProviderABI);
            let decodedRevertReason;
            try {
                decodedRevertReason = iface.decodeFunctionData(iface.getFunction('flashLoan'), error.data); // decoding error data using the correct function info
            } catch (decodingError) {
                console.error(`Error decoding revert reason: ${decodingError}`);
            }

            if (decodedRevertReason) {
                console.error('Decoded revert reason:', decodedRevertReason);
            }
        }
    }
};
main().catch(console.error);