let web3, contract, accounts;
const contractAddress = "0x8724Be47A52aA5b922DDA6313A4bA2E80b57224A";
const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_ticketPriceInWei",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minPlayers",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ticketPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minPlayers",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "LotteryStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "LotteryStopped",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PayoutPending",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "TicketPriceChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TicketPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "WinnerSelected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawn",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasTicket",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "isActive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "minPlayers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "pendingWinnings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "players",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "ticketPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "totalPot",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "winner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newPriceInWei",
          "type": "uint256"
        }
      ],
      "name": "setTicketPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minPlayers",
          "type": "uint256"
        }
      ],
      "name": "setMinPlayers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "buyTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "drawWinner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawPrize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "withdrawAllByOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startLottery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stopLottery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPlayers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getPlayersCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minP",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "playersCount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "currentWinner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
    ];

// Logging
function timestamp() {
  const dt = new Date();
  return dt.toLocaleTimeString();
}

function log(msg,type="info"){ 
  const out = document.getElementById("output"); 
  const div = document.createElement("div"); 
  div.className = `log-${type}`; 
  div.textContent = `[${timestamp()}] ${msg}`; 
  out.appendChild(div); 
  out.parentElement.scrollTop = out.scrollHeight;
}

function clearLog() {
  const out = document.getElementById("output");
  out.innerText = "";
}

// Global status
function setGlobalStatus(text, level = "info") {
  const g = document.getElementById("globalStatusText");
  g.innerText = text;
  const parent = document.getElementById("globalStatus");
  if (level === "error") {
    parent.style.color = "#b02a37";
    parent.style.borderColor = "rgba(220,53,69,0.18)";
  } else if (level === "warn") {
    parent.style.color = "#8a6d00";
    parent.style.borderColor = "rgba(255,193,7,0.12)";
  } else {
    parent.style.color = "#1366c2";
    parent.style.borderColor = "rgba(30,144,255,0.12)";
  }
}

function setStage(stageIndex) {
  const stages = ["start", "players", "draw", "end"];
  const texts = [
    "Waiting for owner to start lottery...",
    "Waiting for min amount of players...",
    "Waiting for lottery selecting winner...",
    "Waiting for lottery closure..."
  ];

  for (let i = 0; i < stages.length; i++) {
    const el = document.getElementById(`stage-${stages[i]}`);
  }
  const currentEl = document.getElementById(`stage-${stages[stageIndex]}`);

  document.getElementById("stage-start-text").innerText = texts[0];
  document.getElementById("stage-players-text").innerText = texts[1];
  document.getElementById("stage-draw-text").innerText = texts[2];
  document.getElementById("stage-end-text").innerText = texts[3];
}

// Players progress
async function updateProgress() {
  if (!contract) return;
  try {
    const playersCount = parseInt(await contract.methods.getPlayersCount().call());
    const minPlayers = parseInt(await contract.methods.minPlayers().call());
    const isActive = await contract.methods.isActive().call().catch(() => false);
    const progressBar = document.getElementById("playersProgressBar");
    progressBar.style.width = minPlayers > 0 ? Math.min(100, Math.round((playersCount / minPlayers) * 100)) + "%" : "0%";
    const playersTextEl = document.getElementById("stage-players-text");
    playersTextEl.innerText = `${playersCount} / ${minPlayers} players`;
    if (!isBuyingTicket) { 
      if (isActive) {
        if (playersCount < minPlayers) {
          setGlobalStatus("Players joining...", "info");
          setStage(1);
        } else {
          setGlobalStatus("Minimum players reached — ready for draw", "info");
          setStage(1);
        }
      } else {
        setGlobalStatus("Lottery inactive", "warn");
        setStage(0);
      }
    }
  } catch (err) {
    log("Error updating progress: " + (err.message || err), "error");
  }
}

async function init() {
  try {
    if (!window.ethereum) {
      setGlobalStatus("MetaMask account not found", "error");
      log("MetaMask account not found", "error");
      return;
    }
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, contractAddress);

    log("Connected: " + accounts.join(", "), "info");
    setGlobalStatus("Connected: " + (accounts[0] || "unknown"), "info");
    await updateProgress();

    if (contract.events && contract.events.allEvents) {
      contract.events.allEvents({}, (err, ev) => {
        if (!err) {
          const eventName = ev.event || "event";
          log(`Event ${eventName} received: ${JSON.stringify(ev.returnValues)}`, "info");
          updateProgress();
        }
      });
    }
    setInterval(updateProgress, 8000);
  } catch (err) {
    log("Init error: " + (err.message || err), "error");
  }
}

// Owner functions
async function ownerTx(method, successMsg, stageIndex) {
  try {
    setGlobalStatus(successMsg + "...", "info");
    setStage(stageIndex);
    log(`Owner: ${method._method.name} called`, "pending");
    const tx = method.send({ from: accounts[0] });

    tx.on("transactionHash", (hash) => {
      log("Transaction hash: " + hash, "info");
      setGlobalStatus("Transaction sent — waiting for confirmation...", "info");
    });
    tx.on("receipt", async (receipt) => {
      log(successMsg + " Tx: " + receipt.transactionHash, "success");
      await updateProgress();
    });
    tx.on("error", (err) => {
      log(method._method.name + " error: " + (err.message || err), "error");
      setGlobalStatus("Error during " + method._method.name, "error");
    });

    await tx;
  } catch (err) {
    log(method._method.name + " exception: " + (err.message || err), "error");
  }
}

function startLottery() {
  return ownerTx(contract.methods.startLottery(), "Lottery started!", 1);
}

function stopLottery() {
  return ownerTx(contract.methods.stopLottery(), "Lottery stopped!", 0);
}

function drawWinner() {
  return ownerTx(contract.methods.drawWinner(), "Winner selected", 3).then(async () => {
    try {
      const winner = await contract.methods.winner().call();
      log("Winner: " + winner, "success");
      setGlobalStatus("Winner: " + shorten(winner), "success");
      animateWinner(winner);
    } catch (e) {
      log("Error reading winner: " + (e.message || e), "error");
    }
  });
}

function setTicketPricePrompt() {
  const price = prompt("Enter new ticket price in wei:");
  if (price) setTicketPrice(price);
}

function setTicketPrice(price) {
  return ownerTx(contract.methods.setTicketPrice(price), "Ticket price set: " + price, 1);
}

function setMinPlayersPrompt() {
  const minPlayers = prompt("Enter new minimum players:");
  if (minPlayers) setMinPlayers(minPlayers);
}

function setMinPlayers(minPlayers) {
  return ownerTx(contract.methods.setMinPlayers(minPlayers), "Minimum players set: " + minPlayers, 1);
}

function withdrawAllByOwnerPrompt() {
  const addr = prompt("Enter address to withdraw all funds:");
  if (addr) withdrawAllByOwner(addr);
}

function withdrawAllByOwner(addr) {
  return ownerTx(contract.methods.withdrawAllByOwner(addr), "Owner withdrew all funds to " + addr, 1);
}

// Player functions
function shorten(address) {
  if (!address) return "";
  return address.slice(0, 6) + "…" + address.slice(-4);
}

let isBuyingTicket = false;
async function buyTicket() {
  try {
    const buyer = accounts[0];
    log(`${shorten(buyer)} buying ticket...`, "pending");
    setGlobalStatus(`${shorten(buyer)} buying ticket...`, "info");
    setStage(1);
    isBuyingTicket = true;
    const price = await contract.methods.ticketPrice().call().catch(() => 0);
    const tx = contract.methods.buyTicket().send({ from: buyer, value: price });

    tx.on("transactionHash", (hash) => {
      log("buyTicket txHash: " + hash, "info");
    });
    tx.on("receipt", (receipt) => {
      log("Ticket purchased: Tx " + receipt.transactionHash, "success");
      setGlobalStatus("Purchase confirmed", "success");
      isBuyingTicket = false;
      updateProgress();
    });
    tx.on("error", (err) => {
      log("buyTicket error: " + (err.message || err), "error");
      setGlobalStatus("Error buying ticket", "error");
      isBuyingTicket = false;
      updateProgress();
    });

    await tx;
  } catch (err) {
    log("buyTicket exception: " + (err.message || err), "error");
    setGlobalStatus("Error initiating purchase", "error");
    isBuyingTicket = false;
  }
}

async function withdrawPrize() {
  try {
    const user = accounts[0];
    log(`${shorten(user)} withdrawing prize...`, "pending");
    const tx = contract.methods.withdrawPrize().send({ from: user });

    tx.on("transactionHash", (hash) => log("txHash: " + hash, "info"));
    tx.on("receipt", (receipt) => log("Prize withdrawn! Tx: " + receipt.transactionHash, "success"));
    tx.on("error", (err) => log("withdrawPrize error: " + (err.message || err), "error"));

    await tx;
  } catch (err) {
    log("withdrawPrize exception: " + (err.message || err), "error");
  }
}

async function checkMyTicket() {
  try {
    const has = await contract.methods.hasTicket(accounts[0]).call();
    log(has ? "You have a ticket." : "You do not have a ticket.", has ? "success" : "info");
  } catch (err) {
    log("checkMyTicket error: " + (err.message || err), "error");
  }
}

async function checkMyWinnings() {
  try {
    const win = await contract.methods.pendingWinnings(accounts[0]).call();
    log(`Pending winnings: ${web3.utils.fromWei(win, "ether")} ETH`, "info");
  } catch (err) {
    log("checkMyWinnings error: " + (err.message || err), "error");
  }
}

// View info
async function showPlayers() {
  try {
    const players = await contract.methods.getPlayers().call();
    log("Players: " + (players.length ? players.join(", ") : "none"), "info");
  } catch (err) {
    log("showPlayers error: " + (err.message || err), "error");
  }
}

async function showPlayersCount() {
  try {
    const count = await contract.methods.getPlayersCount().call();
    log("Players count: " + count, "info");
  } catch (err) {
    log("showPlayersCount error: " + (err.message || err), "error");
  }
}

async function showWinner() {
  try {
    const winner = await contract.methods.winner().call();
    log("Winner: " + (winner === "0x0000000000000000000000000000000000000000" ? "none" : winner), "success");
  } catch (err) {
    log("showWinner error: " + (err.message || err), "error");
  }
}

async function showStatus() {
  try {
    const status = await contract.methods.getStatus().call();
    log("Lottery Status:", "info");
    log("  Active: " + (status.active ? "Yes" : "No"), "info");
    log("  Ticket Price: " + web3.utils.fromWei(status.price, "ether") + " ETH", "info");
    log("  Minimum Players Required: " + status.minP, "info");
    log("  Current Players: " + status.playersCount, "info");
    log("  Current Winner: " + (status.currentWinner === "0x0000000000000000000000000000000000000000" ? "None" : status.currentWinner), "info");
  } catch (err) {
    log("showStatus error: " + (err.message || err), "error");
  }
}

async function showBalance() {
  try {
    const balance = await contract.methods.getBalance().call();
    log("Lottery balance: " + web3.utils.fromWei(balance, "ether") + " ETH", "info");
  } catch (err) {
    log("showBalance error: " + (err.message || err), "error");
  }
}

// Winner highlight
function animateWinner(address) {
  const out = document.getElementById("output");
  const note = document.createElement("div");
  note.className = "winner-note";
  note.textContent = `🏆 Winner: ${address} 🏆`;
  out.appendChild(note);
  const container = document.getElementById("outputContainer");
  container.scrollTop = out.scrollHeight;
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  init();
});