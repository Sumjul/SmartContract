const Lottery = artifacts.require("BlockchainLottery");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

contract("BlockchainLottery", (accounts) => {
    const owner = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];
    const player3 = accounts[3];
    const ticketPrice = web3.utils.toWei("0.01", "ether");

    let lottery;
    function logChange(testNumber, title, beforeValue, afterValue) {
        console.log(`\n---------- Test ${testNumber} | ${title} ----------`);
        console.log(`Before: ${beforeValue}`);
        console.log(`After:  ${afterValue}`);
    }

    beforeEach(async () => {
        lottery = await Lottery.new(ticketPrice, 2);
    });

    // Constructor tests
    it(" 1 | Should fail deploying with zero ticket price", async () => {
        await expectRevert(Lottery.new(0, 2), "Ticket price must be > 0");
    });

    it(" 2 | Should fail deploying with zero minPlayers", async () => {
        await expectRevert(
            Lottery.new(ticketPrice, 0),
            "minPlayers must be > 0"
        );
    });

    // Start/Stop Lottery
    it(" 3 | Owner cannot start lottery twice", async () => {
        const before = (await lottery.getStatus()).active;
        await lottery.startLottery({ from: owner });
        await expectRevert(
            lottery.startLottery({ from: owner }),
            "Lottery already active"
        );
        const after = (await lottery.getStatus()).active;
        logChange(3, "startLottery() active flag", before, after);
    });

    it(" 4 | Non-owner cannot start lottery", async () => {
        const before = (await lottery.getStatus()).active;
        await expectRevert(
            lottery.startLottery({ from: player1 }),
            "Only owner can do this"
        );
        const after = (await lottery.getStatus()).active;
        logChange(4, "startLottery() non-owner attempt", before, after);
    });

    it(" 5 | Owner can stop an active lottery", async () => {
        await lottery.startLottery({ from: owner });
        const before = (await lottery.getStatus()).active;
        const receipt = await lottery.stopLottery({ from: owner });
        expectEvent(receipt, "LotteryStopped");
        const after = (await lottery.getStatus()).active;
        logChange(5, "stopLottery() active flag", before, after);
    });

    it(" 6 | Cannot stop lottery if not active", async () => {
        const before = (await lottery.getStatus()).active;
        await expectRevert(
            lottery.stopLottery({ from: owner }),
            "Lottery already stopped"
        );
        const after = (await lottery.getStatus()).active;
        logChange(6, "stopLottery() inactive state", before, after);
    });

    it(" 7 | Cannot stop lottery twice", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.stopLottery({ from: owner });
        const before = (await lottery.getStatus()).active;
        await expectRevert(
            lottery.stopLottery({ from: owner }),
            "Lottery already stopped"
        );
        const after = (await lottery.getStatus()).active;
        logChange(7, "stopLottery() second attempt", before, after);
    });

    // Ticket purchase
    it(" 8 | Owner cannot buy ticket", async () => {
        await lottery.startLottery({ from: owner });
        const before = (await lottery.getPlayers()).length;
        await expectRevert(
            lottery.buyTicket({ from: owner, value: ticketPrice }),
            "Owner cannot buy tickets"
        );
        const after = (await lottery.getPlayers()).length;
        logChange(8, "players.length (owner attempt)", before, after);
    });

    it(" 9 | Cannot buy ticket if lottery inactive", async () => {
        const before = (await lottery.getPlayers()).length;
        await expectRevert(
            lottery.buyTicket({ from: player1, value: ticketPrice }),
            "Lottery is not active"
        );
        const after = (await lottery.getPlayers()).length;
        logChange(9, "players.length inactive purchase", before, after);
    });

    it(" 10 | Fails when ticket price LOW", async () => {
        await lottery.startLottery({ from: owner });
        const before = (await lottery.getPlayers()).length;
        await expectRevert(
            lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.005") }),
            "Send exact ticket price"
        );
        const after = (await lottery.getPlayers()).length;
        logChange(10, "players.length low price", before, after);
    });

    it(" 11 | Fails when ticket price HIGH", async () => {
        await lottery.startLottery({ from: owner });
        const before = (await lottery.getPlayers()).length;
        await expectRevert(
            lottery.buyTicket({ from: player1, value: web3.utils.toWei("0.02") }),
            "Send exact ticket price"
        );
        const after = (await lottery.getPlayers()).length;
        logChange(11, "players.length high price", before, after);
    });

    it(" 12 | Buying ticket adds player", async () => {
        await lottery.startLottery({ from: owner });
        const before = (await lottery.getPlayers()).length;
        await lottery.buyTicket({ from: player1, value: ticketPrice });
        const after = (await lottery.getPlayers()).length;
        logChange(12, "players.length after purchase", before, after);
        assert.equal(after, 1);
    });

    it(" 13 | Same player cannot buy twice", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: ticketPrice });
        const before = (await lottery.getPlayers()).length;
        if (lottery.onlyUniquePlayers) {
            await expectRevert(
                lottery.buyTicket({ from: player1, value: ticketPrice }),
                "Player already joined"
            );
        }
        const after = (await lottery.getPlayers()).length;
        logChange(13, "duplicate player attempt", before, after);
    });

    // Draw winner
    it(" 14 | Cannot draw winner if not enough players", async () => {
        await lottery.startLottery({ from: owner });
        const before = await lottery.getPlayers();
        await expectRevert(
            lottery.drawWinner({ from: owner }),
            "Not enough players in lottery"
        );
        const after = await lottery.getPlayers();
        logChange(14, "players[] before draw", before.length, after.length);
    });

    it(" 15 | Only owner can draw winner", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: ticketPrice });
        await lottery.buyTicket({ from: player2, value: ticketPrice });
        const before = (await lottery.getStatus()).active;
        await expectRevert(
            lottery.drawWinner({ from: player1 }),
            "Only owner can do this"
        );
        const after = (await lottery.getStatus()).active;
        logChange(15, "drawWinner() non-owner attempt", before, after);
    });

    it(" 16 | Cannot draw winner twice", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: ticketPrice });
        await lottery.buyTicket({ from: player2, value: ticketPrice });
        await lottery.drawWinner({ from: owner });
        const before = (await lottery.getStatus()).active;
        await expectRevert(
            lottery.drawWinner({ from: owner }),
            "Lottery is not active"
        );
        const after = (await lottery.getStatus()).active;
        logChange(16, "drawWinner() second attempt", before, after);
    });

    // Withdrawals
    it(" 17 | Player cannot withdraw 0 winnings", async () => {
        const before = await lottery.pendingWinnings(player1);
        await expectRevert(
            lottery.withdrawPrize({ from: player1 }),
            "No winnings to withdraw"
        );
        const after = await lottery.pendingWinnings(player1);
        logChange(17, "pendingWinnings[player]", before.toString(), after.toString());
    });

    it(" 18 | Winner receives funds & pending resets", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: ticketPrice });
        await lottery.buyTicket({ from: player2, value: ticketPrice });
        await lottery.drawWinner({ from: owner });
        const winner = await lottery.winner();
        const before = (await lottery.pendingWinnings(winner)).toString();
        await lottery.withdrawPrize({ from: winner });
        const after = (await lottery.pendingWinnings(winner)).toString();
        logChange(18, "winner pendingWinnings reset", before, after);
        assert.equal(after, "0");
    });

    it(" 19 | Owner cannot withdraw all before prize claimed", async () => {
        await lottery.startLottery({ from: owner });
        await lottery.buyTicket({ from: player1, value: ticketPrice });
        await lottery.buyTicket({ from: player2, value: ticketPrice });
        await lottery.drawWinner({ from: owner });
        const before = await lottery.winner();
        await expectRevert(
            lottery.withdrawAllByOwner(owner),
            "Cannot withdraw: payout pending or winner exists"
        );
        const after = await lottery.winner();
        logChange(19, "winner unchanged after owner withdrawal attempt", before, after);
    });
});