
const hre = require("hardhat");
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');
const tokens = require("./token.json");

async function main() {
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  let tab = [];
  tokens.map(token =>{
    console.log(token.address);
    tab.push(token.address);
  })
  const leaves = tab.map(address => keccak256(address));
  const tree = new MerkleTree(leaves, keccak256, {sort: true});
  const root = tree.getHexRoot();
  const Billionaire = await hre.ethers.getContractFactory("Billionaire");
  const billionaire = await Billionaire.deploy("Billionaire.comReal/" , "hiiden/BL.json", root);
  await billionaire.deployed();


  console.log("Billioanire Contract deployed to:\n", billionaire.address);
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
