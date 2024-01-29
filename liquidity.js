const { Web3 } = require('web3');
require('dotenv').config();

const MyToken_ABI = require('./artifacts/contracts/Token.sol/MyToken.json').abi;
const provider = 'https://polygon-mumbai.infura.io/v3/341e4922a3e34deaa80cebb4c4b1fd51';
const web3 = new Web3(provider);

// Add your wallet to the web3 instance with your private key to sign transactions
const account = web3.eth.accounts.wallet.add('0xe6e48815911df3fb56390a084da468c9e659819b367165c45589f508759947a5');

const fromAddress = '0x6522EB9583165E6afDCafC5f8938b100e836Af54';

// The address of your deployed MyToken contract and FlashLoanProvider contract
const myTokenContractAddress = '0x013c27638173Df3A1807603090e0AD199117Cf85';
const flashLoanProviderAddress = '0xf5d748D124F913479536F89188E99b2786e2D64b';

// The amount of tokens you want to mint and provide as liquidity
const amountToMintAndProvide = '1000000'; // For example, 1 million tokens

async function mintAndProvideLiquidity() {
    const myTokenContract = new web3.eth.Contract(MyToken_ABI, myTokenContractAddress);

    console.log(`Minting ${amountToMintAndProvide} tokens and providing them as liquidity...`);

    try {
        // Mint tokens directly to the flash loan provider's address
        const mintTx = await myTokenContract.methods.mint(flashLoanProviderAddress, web3.utils.toWei(amountToMintAndProvide, 'ether')).send({
            from: fromAddress,
            gas: 200000, // Adjust gas limit based on actual contract requirements and network conditions
            gasPrice: web3.utils.toWei('10', 'gwei'), // Set to current network conditions
        });
        
        console.log(`Mint transaction hash: ${mintTx.transactionHash}`);
        
        // Check the liquidity balance after minting
        const liquidityBalance = await myTokenContract.methods.balanceOf(flashLoanProviderAddress).call();

        console.log(`FlashLoanProvider's liquidity balance: ${web3.utils.fromWei(liquidityBalance, 'ether')} tokens`);
    } catch (error) {
        console.error(`An error occurred while minting and providing liquidity: ${error.message}`);
    }
}

mintAndProvideLiquidity();
  


