# Minimalist Polygon Staking and Flash Loan DApp

 This is a decentralized application enables users to engage in staking and borrowing through flash loans on the Polygon network, emphasizing simplicity and efficiency in operations and user interface.

# Features
*  Staking: Users can stake their tokens to earn rewards based on the staking duration and amount.
*  Flash Loans: Offers flash loan services, allowing users to borrow cryptocurrency without collateral for one transaction block duration.
*  Minimalist Design: Focuses on a clean and straightforward user interface to ensure ease of use.
*  Fast and Low-Cost Transactions: Utilizes the Polygon network for faster transactions and lower gas fees compared to Ethereum mainnet.

# Technologies Used
*  Solidity: For writing smart contracts that run on the Polygon blockchain.
*  Hardhat: Used for developing, testing, and deploying smart contracts.
*  Ethers.js: A library to interact with Ethereum blockchain from the command line.
*  Node.js: Supports the runtime for CLI interactions.

# Prerequisites
*  Node.js installed (v12.x or higher)
*  Yarn or npm installed
*  MetaMask or another Ethereum wallet connected to your browser
*  Polygon Mumbai for transactions

# Installation
*  Clone the repository

       git clone https://github.com/amalendusuresh/PolygonStake.git

*  Navigate to the repository

       cd cli

*  Install dependencies

       npm install

*  Compile the smart contracts
    
       npx hardhat compile

* Deploy the contract to the desired network

       npx hardhat run scripts/deploy.js --network mumbai

* Calling CLI  functions from NodeJS

       node cli.js

*  Liquidity 

      node liquidity.js


# Token Contarct

    https://mumbai.polygonscan.com/address/0x013c27638173Df3A1807603090e0AD199117Cf85#code


# Polygon Staking

    https://mumbai.polygonscan.com/address/0x188034A071E7D61E90ffa72223c888E91dB544D2#code


# Flash Loan Contarct

    https://mumbai.polygonscan.com/address/0xf5d748D124F913479536F89188E99b2786e2D64b#code


# Flash Loan Receiver

    https://mumbai.polygonscan.com/address/0x683d707352283d29D998DAa97C0cE15BCA978900#code
