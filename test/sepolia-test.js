const Lottery = artifacts.require("BlockchainLottery");

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function safeCall(fn, retry = 5) {
  while (retry > 0) {
    try {
      return await fn();
    } catch (err) {
      if (String(err.message).includes("rate") || err.code === -32029) {
        console.log(` RPC rate limited, retrying... (${retry})`);
        await delay(1500);
        retry--;
      } else {
        throw err;
      }
    }
  }
  throw new Error("RPC limit exceeded repeatedly");
}

module.exports = async function (callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const [owner, p1, p2, p3] = accounts;
    const ticketPrice = web3.utils.toWei("0.01", "ether");
    const eth = (v) => web3.utils.fromWei(v, "ether");

    const logBalance = async (addr, label) => {
      const balance = await safeCall(() => web3.eth.getBalance(addr));
      console.log(`${label}: ${eth(balance)} ETH`);
      await delay(400);
    };

    console.log("Deploying contract...");
    const lottery = await Lottery.new(ticketPrice, 2, { from: owner });
    console.log("Contract deployed at:", lottery.address);
    await logBalance(owner, "Owner balance");

    console.log("\n--- TEST 1: Start lottery ---");
    await safeCall(() => lottery.startLottery({ from: owner }));
    console.log("Lottery started.");

    console.log("\n--- TEST 2: Reject buying ticket without enough ETH ---");
    try {
      await safeCall(() => lottery.buyTicket({ from: p1, value: 0 }));
      console.log("❌ INVALID: Ticket purchase with 0 ETH should fail!");
    } catch {
      console.log("✔️ Correctly reverted (0 ETH not allowed)");
    }

    console.log("\n--- TEST 3: Players buy tickets ---");
    await logBalance(p1, "P1 before");
    await safeCall(() => lottery.buyTicket({ from: p1, value: ticketPrice }));
    await logBalance(p2, "P2 before");
    await safeCall(() => lottery.buyTicket({ from: p2, value: ticketPrice }));
    await logBalance(p3, "P3 before");
    await safeCall(() => lottery.buyTicket({ from: p3, value: ticketPrice }));

    const players = await safeCall(() => lottery.getPlayers());
    console.log("Players:", players);
    const contractBalance = await safeCall(() =>
      web3.eth.getBalance(lottery.address)
    );
    console.log("Contract balance:", eth(contractBalance), "ETH");

    console.log("\n--- TEST 4: Non-owner cannot draw winner ---");
    try {
      await safeCall(() => lottery.drawWinner({ from: p1 }));
      console.log("❌ INVALID: non-owner managed to draw winner");
    } catch {
      console.log("✔️ Correctly reverted: only owner can draw");
    }

    console.log("\n--- TEST 5: Owner draws winner ---");
    await safeCall(() => lottery.drawWinner({ from: owner }));
    const winner = await safeCall(() => lottery.winner());
    console.log("Winner selected:", winner);

    console.log("\n--- TEST 6: Winner withdraws prize ---");
    await logBalance(winner, "Winner before withdraw");
    await safeCall(() => lottery.withdrawPrize({ from: winner }));
    await delay(1500);
    await logBalance(winner, "Winner after withdraw");

    const contractBalanceAfter = await safeCall(() =>
      web3.eth.getBalance(lottery.address)
    );
    console.log("Contract balance after withdraw:", eth(contractBalanceAfter), "ETH");
    if (contractBalanceAfter === "0") {
      console.log("✔️ Contract balance correctly emptied.");
    }

    callback();
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
    callback(err);
  }
};