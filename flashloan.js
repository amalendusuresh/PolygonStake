// Import required libraries
const { ethers } = require('ethers');
const prompts = require('prompts');

// Load ABIs and contract addresses
const flashLoanProviderABI = require('./artifacts/contracts/Flashsale.sol/FlashLoanProvider.json').abi;  // Use the ABI for FlashLoanProvider
const mockFlashLoanReceiverABI = require('./artifacts/contracts/FlashsaleReceiver.sol/MockFlashLoanReceiver.json').abi;  // Use the ABI for MockFlashLoanReceiver
const flashLoanProviderAddress = '0x3FCe642833A48ce3b220729aE12eF8539a41e8A9';  // Replace with the actual address
const mockFlashLoanReceiverAddress = '0x474Fd0b80865175053FAD46c608F5cCc8A0f96E7';  // Replace with the actual address

// Set up a provider and signer
// Set up a provider and signer with noEnS option
const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/341e4922a3e34deaa80cebb4c4b1fd51');
const wallet = new ethers.Wallet('e6e48815911df3fb56390a084da468c9e659819b367165c45589f508759947a5', provider);


// Connect to the Flash Loan Provider and Mock Flash Loan Receiver contracts
const flashLoanProvider = new ethers.Contract(flashLoanProviderAddress, flashLoanProviderABI, wallet);
const mockFlashLoanReceiver = new ethers.Contract(mockFlashLoanReceiverAddress, mockFlashLoanReceiverABI, wallet);

// Main function to request a flash loan
const requestFlashLoan = async () => {
    // Ask the user for the amount to flash borrow
    const response = await prompts({
        type: 'number',
        name: 'amount',
        message: 'How much would you like to borrow (in tokens)?',
        validate: value => value > 0 ? true : 'Please enter a positive amount.'
    });

    const amount = ethers.parseUnits(response.amount.toString(), 18);

    try {
        const txResponse = await flashLoanProvider.flashLoan(
            amount,
            mockFlashLoanReceiverAddress,
            '0x', // assuming additional data is not required
            {
                gasLimit: 500000
            }
        );

        const receipt = await txResponse.wait();
        console.log(`Flash loan successful! Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
        console.error('Flash loan request failed:', error.message || error);
        // Process error data if available
        if (error.data) {
            // Decode error.data for more information
        }
    }
};
requestFlashLoan().catch(console.error);

