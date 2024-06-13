const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "YOUR_INFURA_PROJECT_ID";
const mnemonic = "YOUR_MNEMONIC";


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
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4, // Rinkeby ID
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Specify the Solidity compiler version
    }
  }
};
