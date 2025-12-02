const BlockchainLottery = artifacts.require("BlockchainLottery");

module.exports = function (deployer) {
    const ticketPrice = 1000000000000000; // 0.001 ETH
    const minPlayers = 2;

    deployer.deploy(BlockchainLottery, ticketPrice, minPlayers);
};