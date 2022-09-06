require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { INFURA_PROJECT_ID, SIGNER_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [SIGNER_PRIVATE_KEY],
    },
  },
};
