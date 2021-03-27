require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider('', 'https://ropsten.infura.io/v3/d7c905b490bc47569f458007ac0abb07')
      },
      network_id: 3
    }
  },
  contracts_directory: './src/Contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version:"0.8.3",
      settings: {         
        optimizer: {
          enabled: false,
          runs: 200
        },
    }
  }
  }
}