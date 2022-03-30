const NFTContract = artifacts.require("NFT721");
const {USDT_ADDRESS, USDC_ADDRESS, CHAINLINK_ADDRESS} = require('../client/src/config/config')
module.exports = function (deployer) {
  deployer.deploy(NFTContract, USDT_ADDRESS, USDC_ADDRESS, CHAINLINK_ADDRESS);
};
