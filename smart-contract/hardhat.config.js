//https://eth-goerli.g.alchemy.com/v2/zpHhwySxIP9utxJoJf9Jw2xSh6rFfw25
//zpHhwySxIP9utxJoJf9Jw2xSh6rFfw25
// const { JsonRpcProvider } = require("ethers");
// const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Aejzpli9XuTTLv8hYcwIy4qUJ5IWLqAg"); // Replace with your Ethereum node URL
// import{useContext} from 'react';
// import { TransactionContext } from '../client/src/context/TransactionContext'
// const {currentAccount} = useContext(TransactionContext);
require('@nomiclabs/hardhat-waffle')
require('dotenv').config();
module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten:{
      url: 'https://eth-goerli.g.alchemy.com/v2/zpHhwySxIP9utxJoJf9Jw2xSh6rFfw25',
      accounts: ['process.env.PRIVATE_KEY']
    }
  }
}
// accounts:[{currentAccount}]