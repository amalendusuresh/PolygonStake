require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { INFURA_URL, PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env;

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mumbai: {
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
  sourcify: {
    enabled: true
  },
};