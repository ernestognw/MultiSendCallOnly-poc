// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const EthersAdapter = require("@gnosis.pm/safe-ethers-lib").default;
const Safe = require("@gnosis.pm/safe-core-sdk").default;
const { Interface } = require("@ethersproject/abi");
const { hexDataLength } = require("@ethersproject/bytes");
const { pack } = require("@ethersproject/solidity");
const {
  safeAddress,
  multisendContractAddress,
} = require("../config/environment");

const MULTI_SEND_ABI = ["function multiSend(bytes memory transactions)"];

const encodePacked = ({ operation, to, value, data }) =>
  pack(
    ["uint8", "address", "uint256", "uint256", "bytes"],
    [operation, to, value, hexDataLength(data), data]
  );

const remove0x = (hexString) => hexString.substring(2);

const encodeMulti = (transactions, multiSendContractAddress) => {
  const transactionsEncoded =
    "0x" + transactions.map(encodePacked).map(remove0x).join("");

  const multiSendContract = new Interface(MULTI_SEND_ABI);
  const data = multiSendContract.encodeFunctionData("multiSend", [
    transactionsEncoded,
  ]);

  return {
    operation: 1, // DELEGATE_CALL
    to: multiSendContractAddress,
    value: "0x00",
    data,
  };
};

const transactions = [
  {
    // Approve 0xbcD0A9e5a39Cd9591fDAD4c4b8D15E9bA73A0596
    operation: 0, // CALL
    to: "0x8d99Bd644f6DcD59E91ab90331c8D7F386A4d996",
    value: 0,
    data: "0x095ea7b3000000000000000000000000bcd0a9e5a39cd9591fdad4c4b8d15e9ba73a059600000000000000000000000000000000000000000000000000000000000f423f",
  },
  {
    // Transfer to self
    operation: 0, // CALL
    to: "0xbcD0A9e5a39Cd9591fDAD4c4b8D15E9bA73A0596",
    value: 0,
    data: "0xdb87fea6000000000000000000000000000000000000000000000000000000000000000a",
  },
  {
    // Remove approval
    operation: 0,
    to: "0x8d99Bd644f6DcD59E91ab90331c8D7F386A4d996",
    value: 0,
    data: "0x095ea7b3000000000000000000000000bcd0a9e5a39cd9591fdad4c4b8d15e9ba73a05960000000000000000000000000000000000000000000000000000000000000000",
  },
];

async function main() {
  const [signer] = await hre.ethers.getSigners();

  const ethAdapter = new EthersAdapter({
    ethers: hre.ethers,
    signer,
  });

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData: encodeMulti(transactions, multisendContractAddress),
  });

  const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);

  console.log(executeTxResponse);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
