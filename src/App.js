import { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import Contract from './artifacts/contracts/Billionaire.sol/Billionaire.json';
import './App.css';

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const tokens = require('./tokens.json');

const address = "0x7E511C6235B7Fd0Df4612f6F14b373dC66268983";

function App() { 

  const [accounts, setAccounts] = useState([]);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    requestAccount();
  }, [])

  async function requestAccount() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccounts(accounts);
    }
  }

  async function mintPresale() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);

      let tab = [];
      tokens.map(token => {
        tab.push(token.address)
      })

      const leaves = tab.map(v => keccak256(v));
      const tree = new MerkleTree(leaves, keccak256, { sort: true });
      const leaf = keccak256(accounts[0]);
      const proof = tree.getHexProof(leaf);

      try {
        const cost = await contract.pricePresale();

        let overrides = {
          from: accounts[0],
          value: cost * amount
        }

        const transaction = await contract.presaleMint(accounts[0], proof, amount , overrides);

        await transaction.wait();
      }
      catch(err) {
        console.log(err);
      }
    }
  }
  async function Salemint() {
    if(typeof window.ethereum !== 'undefined') {

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, Contract.abi, signer);
      try {
        const cost = await contract.priceSale();
        let overrides = {
          from: accounts[0],
          value: cost * amount
        }
        const transaction = await contract.saleMint(BigNumber.from(amount),overrides);

        await transaction.wait();
      }
      catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="App">
      <div className="parentElement">
        <div className="childElement">
       
      <button onClick={requestAccount}>Connect</button>
      <br></br>
        
        <br></br>
        {amount}
      <br></br>
      <br></br>
      
      <button onClick={()=>{setAmount(amount + 1)}}>+</button>
      <button onClick={()=>{setAmount(amount - 1)}}>-</button>

      <button onClick={mintPresale}>MINT Presale</button>
      <br></br>
      <br></br>
      <button onClick={Salemint}>MINT PublicSale</button>

        </div>
      </div>
      

      
    </div>
  );
}

export default App;