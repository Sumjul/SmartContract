const Lottery = artifacts.require("BlockchainLottery");

contract("BlockchainLottery", (accounts) => {
    const owner = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];

    let lottery;

    beforeEach(async () => {
        lottery = await Lottery.new(web3.utils.toWei("0.01", "ether"), 2);
    });

    it(" Should start lottery", async () => {
        await lottery.startLottery({ from: owner });
        const status = await lottery.getStatus();
        assert.equal(status.active, true, " Lottery did not start");
    });

    it(" Players should buy tickets", async () => {
        await lottery.startLottery({ from: owner });

        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01", "ether") });
        await lottery.buyTicket({ from: player2, value: web3.utils.toWei("0.01", "ether") });

        const count = await lottery.getPlayersCount();
        assert.equal(count.toNumber(), 2, " Players not counted correctly");

        const balance = await lottery.getBalance();
        assert.equal(
            balance.toString(),
            web3.utils.toWei("0.02", "ether"),
            " Lottery balance incorrect"
        );
    });

    it(" Should draw a winner and stop lottery", async () => {
        await lottery.startLottery({ from: owner });

        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01", "ether") });
        await lottery.buyTicket({ from: player2, value: web3.utils.toWei("0.01", "ether") });
        await lottery.drawWinner({ from: owner });

        const status = await lottery.getStatus();
        assert.equal(status.active, false, " Lottery should be stopped");

        const winner = await lottery.winner();
        assert.notEqual(winner, "0x0000000000000000000000000000000000000000", " Winner not stored");
    });

    it(" Winner should withdraw prize", async () => {
        await lottery.startLottery({ from: owner });

        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01", "ether") });
        await lottery.buyTicket({ from: player2, value: web3.utils.toWei("0.01", "ether") });
        await lottery.drawWinner({ from: owner });

        const winner = await lottery.winner();
        const pending = await lottery.pendingWinnings(winner);
        assert.equal(
            pending.toString(),
            web3.utils.toWei("0.02", "ether"),
            " Pending winnings incorrect"
        );

        const before = BigInt(await web3.eth.getBalance(winner));
        await lottery.withdrawPrize({ from: winner });

        const after = BigInt(await web3.eth.getBalance(winner));
        assert(after > before, " Winner did not receive funds");
    });
});