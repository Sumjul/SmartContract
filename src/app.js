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
function log(msg, type="info") {
  const output = document.getElementById("output");
  let color;
  switch(type) {
    case "error": color = "red"; break;
    case "success": color = "lime"; break;
    case "warn": color = "yellow"; break;
    default: color = "white";
  }
  output.innerHTML += `<span style="color:${color}">${msg}</span>\n`;
  output.scrollTop = output.scrollHeight;
}

function clearLog() {
  document.getElementById("output").innerText = "";
}

async function init() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, contractAddress);
    log("MetaMask accounts: " + accounts, "success");
    log("Contract owner: " + await contract.methods.owner().call(), "success");
    await updateProgress();
  } else {
    log("MetaMask not found", "error");
  }
}

// Progress bar
async function updateProgress() {
  try {
    const playersCount = await contract.methods.getPlayersCount().call();
    const minPlayers = await contract.methods.minPlayers().call();
    const percent = Math.min((playersCount / minPlayers) * 100, 100);

    document.getElementById("lotteryProgressBar").style.width = percent + "%";
    document.getElementById("progressText").innerText = `${playersCount} / ${minPlayers} players`;
  } catch (err) {
    log("updateProgress error: " + err.message, "error");
  }
}

// Owner functions
async function startLottery() {
  try {
    await contract.methods.startLottery().send({ from: accounts[0] });
    log("Lottery started!", "success");
    await updateProgress();
  } catch (err) {
    log("startLottery error: " + err.message, "error");
  }
}

async function stopLottery() {
  try {
    await contract.methods.stopLottery().send({ from: accounts[0] });
    log("Lottery stopped!", "warn");
  } catch (err) {
    log("stopLottery error: " + err.message, "error");
  }
}

async function drawWinner() {
  try {
    await contract.methods.drawWinner().send({ from: accounts[0] });
    const winner = await contract.methods.winner().call();
    animateWinner(winner);
    log("Winner drawn: " + winner, "success");
    await updateProgress();
  } catch (err) {
    log("drawWinner error: " + err.message, "error");
  }
}

async function setTicketPricePrompt() {
  const price = prompt("Enter new ticket price in wei:");
  if (price) setTicketPrice(price);
}

async function setTicketPrice(newPrice) {
  try {
    await contract.methods.setTicketPrice(newPrice).send({ from: accounts[0] });
    log("Ticket price set to " + newPrice, "success");
  } catch (err) {
    log("setTicketPrice error: " + err.message, "error");
  }
}

async function setMinPlayersPrompt() {
  const minP = prompt("Enter new min players:");
  if (minP) setMinPlayers(minP);
}

async function setMinPlayers(minPlayers) {
  try {
    await contract.methods.setMinPlayers(minPlayers).send({ from: accounts[0] });
    log("Min players set to " + minPlayers, "success");
  } catch (err) {
    log("setMinPlayers error: " + err.message, "error");
  }
}

async function withdrawAllByOwnerPrompt() {
  const to = prompt("Enter address to withdraw all funds to:");
  if (to) withdrawAllByOwner(to);
}

async function withdrawAllByOwner(to) {
  try {
    await contract.methods.withdrawAllByOwner(to).send({ from: accounts[0] });
    log("Owner withdrew all funds to " + to, "success");
  } catch (err) {
    log("withdrawAllByOwner error: " + err.message, "error");
  }
}

// Player functions
async function buyTicket() {
  try {
    const price = await contract.methods.ticketPrice().call();
    await contract.methods.buyTicket().send({ from: accounts[0], value: price });
    log("Ticket bought!", "success");
    await updateProgress();
  } catch (err) {
    log("buyTicket error: " + err.message, "error");
  }
}

async function withdrawPrize() {
  try {
    await contract.methods.withdrawPrize().send({ from: accounts[0] });
    log("Prize withdrawn!", "success");
  } catch (err) {
    log("withdrawPrize error: " + err.message, "error");
  }
}

async function checkMyTicket() {
  const has = await contract.methods.hasTicket(accounts[0]).call();
  log("You " + (has ? "have" : "do not have") + " a ticket.");
}

async function checkMyWinnings() {
  const win = await contract.methods.pendingWinnings(accounts[0]).call();
  log("Your pending winnings: " + web3.utils.fromWei(win, "ether") + " ETH");
}

// View info
async function showPlayers() {
  const players = await contract.methods.getPlayers().call();
  log("Players: " + (players.length ? players.join(", ") : "none"));
}

async function showPlayersCount() {
  const count = await contract.methods.getPlayersCount().call();
  log("Players count: " + count);
}

async function showWinner() {
  const winner = await contract.methods.winner().call();
  log(
    "Winner: " + (winner === "0x0000000000000000000000000000000000000000" ? "none" : winner),
    "success"
  );
}

async function showStatus() {
  const status = await contract.methods.getStatus().call();
  log(`Status:
  Active: ${status.active}
  Ticket price: ${status.price}
  Min players: ${status.minP}
  Players count: ${status.playersCount}
  Current winner: ${status.currentWinner}`);
}

async function showBalance() {
  const balance = await contract.methods.getBalance().call();
  log("Contract balance: " + web3.utils.fromWei(balance, "ether") + " ETH");
}

function animateWinner(address) {
  const output = document.getElementById("output");
  const winnerDiv = document.createElement("div");
  winnerDiv.style.color = "gold";
  winnerDiv.style.fontWeight = "bold";
  winnerDiv.style.fontSize = "20px";
  winnerDiv.style.textAlign = "center";
  winnerDiv.style.marginTop = "10px";
  winnerDiv.innerText = `🏆 Winner: ${address} 🏆`;

  output.appendChild(winnerDiv);
  output.scrollTop = output.scrollHeight;
}

window.addEventListener("DOMContentLoaded", init);