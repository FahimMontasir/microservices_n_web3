// Add the expected JSON formatted input, specifying the language, sources, and outputSelection

// Update the export to provide the expected JSON formatted output

// Note - the output is structured differently so the accessors have changed slightly. If you have a doubt you can add a console.log to view this structure:
// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts);

// This will return the following:
// {
//   'Inbox.sol': {
//     Inbox: {
//       abi: [Array],
//       devdoc: [Object],
//       evm: [Object],
//       ewasm: [Object],
//       metadata: '{...}',
//       storageLayout: [Object],
//       userdoc: [Object]
//     }
//   }
// }

const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Inbox.sol"
].Inbox;
