const dotenv = require("dotenv");
dotenv.config();

const safeAddress = process.env.SAFE_ADDRESS;
const multisendContractAddress = process.env.MULTI_SEND_CONTRACT_ADDRESS;

module.exports = { safeAddress, multisendContractAddress };
