const Lottery = artifacts.require("BlockchainLottery");

contract("BlockchainLottery", (accounts) => {
    const owner = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];

    let lottery;
    before(async () => {
        lottery = await Lottery.new(web3.utils.toWei("0.01", "ether"), 2);
        console.log("Contract deployed at:", lottery.address);
    });


    it(" |1) Should start lottery", async () => {
        console.log('\n');
        await lottery.startLottery({ from: owner });
        const status = await lottery.getStatus();

        console.log(`Lottery active: ${status[0]}`);
        console.log(`Ticket price: ${web3.utils.fromWei(status[1].toString(), "ether")} ETH`);
        console.log(`Max players: ${status[2].toString()}`);

        assert.equal(status[0], true);
    });


    it(" |2) Players should buy tickets", async () => {
        console.log('\n');
        const bal1_before = await web3.eth.getBalance(player1);
        const bal2_before = await web3.eth.getBalance(player2);
        console.log("Player1 BEFORE:", web3.utils.fromWei(bal1_before), "ETH");
        console.log("Player2 BEFORE:", web3.utils.fromWei(bal2_before), "ETH");

        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01", "ether") });
        await lottery.buyTicket({ from: player2, value: web3.utils.toWei("0.01", "ether") });

        const bal1_after = await web3.eth.getBalance(player1);
        const bal2_after = await web3.eth.getBalance(player2);
        console.log("Player1 AFTER:", web3.utils.fromWei(bal1_after), "ETH");
        console.log("Player2 AFTER:", web3.utils.fromWei(bal2_after), "ETH");

        const count = await lottery.getPlayersCount();
        const balance = await lottery.getBalance();
        console.log("Players in lottery:", count.toNumber());
        console.log("Lottery balance:", web3.utils.fromWei(balance), "ETH");

        assert.equal(count.toNumber(), 2);
        assert.equal(balance.toString(), web3.utils.toWei("0.02", "ether"));
    });


    it(" |3) Should draw a winner and stop lottery", async () => {
        console.log('\n');
        await lottery.drawWinner({ from: owner });

        const status = await lottery.getStatus();
        const winner = await lottery.winner();
        console.log("Winner:", winner);
        console.log("Lottery active:", status.active);

        assert.equal(status.active, false);
        assert.notEqual(winner, "0x0000000000000000000000000000000000000000");
    });

    
    it(" |4) Winner should withdraw prize", async () => {
        console.log('\n');
        const winner = await lottery.winner();
        const pending = await lottery.pendingWinnings(winner);
        console.log("Winner:", winner);
        console.log("Prize:", web3.utils.fromWei(pending), "ETH");

        const before = BigInt(await web3.eth.getBalance(winner));
        console.log("Winner BEFORE:", web3.utils.fromWei(before.toString()), "ETH");

        await lottery.withdrawPrize({ from: winner });

        const after = BigInt(await web3.eth.getBalance(winner));
        console.log("Winner AFTER:", web3.utils.fromWei(after.toString()), "ETH");

        assert(after > before, "Winner did not receive funds");
    });
});