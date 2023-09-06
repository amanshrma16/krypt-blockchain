import React, {useContext, useEffect, useState} from 'react';
import {ethers } from 'ethers';

import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;


const createEthereumContract = () => {
    // if (!ethereum) {
    //     throw new Error("No ethereum object.");
    // }
    if (typeof ethereum === 'undefined' || typeof ethereum.request === 'undefined') {
        throw new Error("Ethereum provider is not available. Please make sure MetaMask is installed and active.");
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    // const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount,setCurrentAccount] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [transactionCount,setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);


    const [formData,setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});

    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState, [name]: e.target.value
        }));
    };


    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = createEthereumContract();
    
            const connectedAccount = currentAccount.toLowerCase(); // Convert to lowercase for consistency
            const availableTransactions = await transactionsContract.getAllTransactions({ filterBySender: connectedAccount });

            // const availableTransactions = await transactionsContract.getAllTransactions();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
    
            setTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };

    const checkIfWalletConnected = async() => {
        try{
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({method: 'eth_accounts'});
    
            if(accounts.length){
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            }else{
                console.log('No accounts found.');
            }
        }catch(error){
            console.log(error);
            throw new Error("No ethereum object.");
        }
        // console.log(accounts);
    }

    const checkIfTransactionsExists = async () => {
        try {
          if (ethereum) {
            const transactionsContract = createEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
            window.location.reload();
        }catch(error){
            console.log(error);

            throw new Error("No ethereum object");
        }
    }


    const sendTransaction = async ()=> {
        try{
            // if(ethereum) return alert("Please install metamask");
            if(ethereum){
            //get data from form
            const{ addressTo, amount, keyword, message} = formData;
            const transactionContract = createEthereumContract();

            const parsedAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
            window.location.reload();
        }else{
            console.log("No ethereum object");
        }
        }catch(error){
            console.log(error);
            throw new Error("No ethereum object.");
        }
    }

    useEffect(()=>{
        checkIfWalletConnected();
        checkIfTransactionsExists();
    },[])

    return(
        <TransactionContext.Provider value={{connectWallet,currentAccount, formData, setFormData, handleChange, sendTransaction, isLoading, transactions, transactionCount}}>
            {children}
        </TransactionContext.Provider>
    );
};