const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  // this is your wallet address mnemonic
  "culture alert awesome jewel coral piano mango exchange busy helmet bargain radio",
  // deployed endpoint
  "https://goerli.infura.io/v3/0492f53af737413cb98b3add871525ed"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ["Hi there!"] })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
// deployed address: 0xf57A34B3cE80Ebe343bBf8A0ff7D01B7Ba5de09d
