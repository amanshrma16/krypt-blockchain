//https://eth-goerli.g.alchemy.com/v2/zpHhwySxIP9utxJoJf9Jw2xSh6rFfw25
//zpHhwySxIP9utxJoJf9Jw2xSh6rFfw25
// const { JsonRpcProvider } = require("ethers");
// const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Aejzpli9XuTTLv8hYcwIy4qUJ5IWLqAg"); // Replace with your Ethereum node URL
// import{useContext} from 'react';
// import { TransactionContext } from '../client/src/context/TransactionContext'
// const {currentAccount} = useContext(TransactionContext);
require('@nomiclabs/hardhat-waffle')
module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli:{
      url: 'https://eth-goerli.g.alchemy.com/v2/zpHhwySxIP9utxJoJf9Jw2xSh6rFfw25',
      accounts: ['55b4d213aa67c6da2b9f4d13799311345caaac991e7a29ebe7e9f63b2f7f6979']
    }
  }
}
// accounts:[{currentAccount}]