
//Here are generating a Root from the token.json file 
const hre = require("hardhat");
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');
const tokens = require("./token.json");
let tab = [];
  tokens.map(token =>{
    tab.push(token.address);
  })
  const leaves = tab.map(address => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, {sort: true});
  const root = tree.getHexRoot();
//the root 
  console.log(root);