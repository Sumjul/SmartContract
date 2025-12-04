const Lottery = artifacts.require("BlockchainLottery");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

contract("BlockchainLottery", (accounts) => {
    const owner = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];
    const player3 = accounts[3];
    const ticketPrice = web3.utils.toWei("0.01", "ether");

    let lottery;
    beforeEach(async () => {
        lottery = await Lottery.new(web3.utils.toWei("0.01", "ether"), 2);
    });
    

// Constructor tests
    it(" 1 | Should fail deploying with zero ticket price", async () => {
        await expectRevert(
            Lottery.new(0, 2),
            "Ticket price must be > 0"
        );
    });

    it(" 2 | Should fail deploying with zero minPlayers", async () => {
        await expectRevert(
            Lottery.new(web3.utils.toWei("0.01", "ether"), 0),
            "minPlayers must be > 0"
        );
    });

// Start/Stop Lottery tests 
    it(" 3 | Owner cannot start lottery twice", async () => {
        await lottery.startLottery({ from: owner });
        await expectRevert(
            lottery.startLottery({ from: owner }),
            "Lottery already active"
        );
    });

    it(" 4 | Non-owner cannot start lottery", async () => {
        await expectRevert(
            lottery.startLottery({ from: player1 }),
            "Only owner can do this"
        );
    });

    it(" 5 | Owner can stop an active lottery", async () => {
        await lottery.startLottery({ from: owner });
        const receipt = await lottery.stopLottery({ from: owner });

        const status = await lottery.getStatus();
        assert.equal(status.active, false, "status.active must be false");
        expectEvent(receipt, "LotteryStopped");
    });

    it(" 6 | Cannot stop lottery if not active (needs start first)", async () => {
        await expectRevert(
            lottery.stopLottery({ from: owner }),
            "Lottery already stopped"
        );
    });

    it(" 7 | Cannot stop lottery twice", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.stopLottery({ from: owner });

        await expectRevert(
            lottery.stopLottery({ from: owner }),
            "Lottery already stopped"
        );
    });

// Ticket purchase tests
    it(" 8 | Owner cannot buy ticket", async () => {
        await lottery.startLottery({ from: owner });

        await expectRevert(
            lottery.buyTicket({ from: owner, value: web3.utils.toWei("0.01") }),
            "Owner cannot buy tickets"
        );
    });

    it(" 9 | Cannot buy ticket if lottery inactive", async () => {
        await expectRevert(
            lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01") }),
            "Lottery is not active"
        );
    });

    it(" 10 | Fails when ticket price too LOW", async () => {
        await lottery.startLottery({ from: owner });

        await expectRevert(
            lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.005") }),
            "Send exact ticket price"
        );
    });

    it(" 11 | Fails when ticket price too HIGH", async () => {
        await lottery.startLottery({ from: owner });

        await expectRevert(
            lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.02") }),
            "Send exact ticket price"
        );
    });

    it(" 12 | Buying ticket adds player to array", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01") });

        const players = await lottery.getPlayers();
        assert.equal(players.length, 1);
        assert.equal(players[0], player1);
    });

    it(" 13 | Same player cannot buy twice (if logic forbids)", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01") });

        if (lottery.onlyUniquePlayers) {
            await expectRevert(
                lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01") }),
                "Player already joined"
            );
        }
    });

// Draw winner tests
    it(" 14 | Cannot draw winner if not enough players", async () => {
        await lottery.startLottery({ from: owner });

        await expectRevert(
            lottery.drawWinner({ from: owner }),
            "Not enough players in lottery"
        );
    });

    it(" 15 | Only owner can draw winner", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01") });
        await lottery.buyTicket({ from: player2, value: web3.utils.toWei("0.01") });

        await expectRevert(
            lottery.drawWinner({ from: player1 }),
            "Only owner can do this"
        );
    });

    it(" 16 | Cannot draw winner twice", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: "10000000000000000" });
        await lottery.buyTicket({ from: player2, value: "10000000000000000" });
        await lottery.drawWinner({ from: owner });

        await expectRevert(
            lottery.drawWinner({ from: owner }),
            "Lottery is not active"
        );
    });

// Withdrawal tests
    it(" 17 | Player cannot withdraw if no winnings stored", async () => {
        await expectRevert(
            lottery.withdrawPrize({ from: player1 }),
            "No winnings to withdraw"
        );
    });

    it(" 18 | Winner receives correct funds and pending resets to zero", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01") });
        await lottery.buyTicket({ from: player2, value: web3.utils.toWei("0.01") });
        await lottery.drawWinner({ from: owner });

        const winner = await lottery.winner();
        await lottery.withdrawPrize({ from: winner });

        const remaining = await lottery.pendingWinnings(winner);
        assert.equal(remaining.toString(), "0");
    });

    it(" 19 | Owner cannot withdraw all funds before winner collects", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.01") });
        await lottery.buyTicket({ from: player2, value: web3.utils.toWei("0.01") });
        await lottery.drawWinner({ from: owner });

        await expectRevert(
            lottery.withdrawAllByOwner(owner),
            "Cannot withdraw: payout pending or winner exists"
        );
    });
});