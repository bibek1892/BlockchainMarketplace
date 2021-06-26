// const Migrations = artifacts.require("Migrations");

// module.exports = function (deployer) {
//   deployer.deploy(Migrations);
// };
const BlockchainMarketplace = artifacts.require("BlockchainMarketplace");
 
module.exports = function (deployer) {
  deployer.deploy(BlockchainMarketplace);
};
