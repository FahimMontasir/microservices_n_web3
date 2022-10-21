// Update the import to destructure the abi (formerly the interface) and the evm (bytecode)
// const { abi, evm } = require('../compile');

// Pass the abi to the contract object
//   inbox = await new web3.eth.Contract(abi)

// Assign the bytecode to the data property of the deploy method:

//     .deploy({
//       data: evm.bytecode.object,

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// import to destructure the abi (formerly the interface) and the evm (bytecode)
const { abi, evm } = require("./compile");

provider = new HDWalletProvider("YOUR_MNEMONIC", "YOUR_INFURA_URL");

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ["Hi there!"] })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy();
