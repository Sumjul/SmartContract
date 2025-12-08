const Lottery = artifacts.require("BlockchainLottery");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];
    const player3 = accounts[3];
    
    const ticketPrice = web3.utils.toWei("0.01", "ether");
    
    console.log("Deploying contract...");
    const lottery = await Lottery.new(ticketPrice, 2, { from: owner });
    console.log("Contract deployed at:", lottery.address);

    await lottery.startLottery({ from: owner });
    console.log("Lottery started");

    await lottery.buyTicket({ from: player1, value: ticketPrice });
    await lottery.buyTicket({ from: player2, value: ticketPrice });
    await lottery.buyTicket({ from: player3, value: ticketPrice });
    console.log("Tickets bought by 3 players");

    const players = await lottery.getPlayers();
    console.log("Players:", players);

    const contractBalance = await web3.eth.getBalance(lottery.address);
    console.log("Contract balance (ETH):", web3.utils.fromWei(contractBalance, "ether"));

    await lottery.drawWinner({ from: owner });
    const winner = await lottery.winner();
    console.log("Winner is:", winner);

    const winnerBalanceBefore = await web3.eth.getBalance(winner);
    await lottery.withdrawPrize({ from: winner });
    const winnerBalanceAfter = await web3.eth.getBalance(winner);
    console.log(
      "Winner balance before:", web3.utils.fromWei(winnerBalanceBefore, "ether"),
      "after:", web3.utils.fromWei(winnerBalanceAfter, "ether")
    );

    callback();
  } catch (err) {
    console.error(err);
    callback(err);
  }
};
