require('dotenv').config();
const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const MNEMONIC = process.env.MNEMONIC;


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/contracts"),
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 7545, // for ganache gui
      // port: 8545, // for ganache-cli
      gas: 6721975,
      gasPrice: 20000000000,
    },
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, SEPOLIA_RPC_URL),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.7.6", // Specify the Solidity compiler version
    }
  }
};
