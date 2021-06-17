const BlockchainMarketplace = artifacts.require("BlockchainMarketplace");
 
module.exports = function (deployer) {
  deployer.deploy(BlockchainMarketplace);
};
