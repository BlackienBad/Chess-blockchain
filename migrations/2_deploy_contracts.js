const ChessSolidity = artifacts.require("ChessSolidity");

module.exports = function(deployer) {
  deployer.deploy(ChessSolidity);
};