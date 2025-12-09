let web3;
let contract;
let accounts;

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

async function init() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, contractAddress);
    log("MetaMask accounts: " + accounts);
    log("Contract owner: " + await contract.methods.owner().call());
  } else {
    log("MetaMask not found");
  }
}

function log(msg) {
  console.log(msg);
  document.getElementById("output").innerText += msg + "\n";
}

// Owner functions
async function startLottery() {
  try {
    await contract.methods.startLottery().send({ from: accounts[0] });
    log("Lottery started!");
  } catch (err) { log("startLottery error: " + err.message); }
}

async function stopLottery() {
  try {
    await contract.methods.stopLottery().send({ from: accounts[0] });
    log("Lottery stopped!");
  } catch (err) { log("stopLottery error: " + err.message); }
}

async function drawWinner() {
  try {
    await contract.methods.drawWinner().send({ from: accounts[0] });
    log("Winner drawn!");
  } catch (err) { log("drawWinner error: " + err.message); }
}

async function setTicketPricePrompt() {
  const price = prompt("Enter new ticket price in wei:");
  if (price) setTicketPrice(price);
}

async function setTicketPrice(newPrice) {
  try {
    await contract.methods.setTicketPrice(newPrice).send({ from: accounts[0] });
    log("Ticket price set to " + newPrice);
  } catch (err) { log("setTicketPrice error: " + err.message); }
}

async function setMinPlayersPrompt() {
  const minP = prompt("Enter new min players:");
  if (minP) setMinPlayers(minP);
}

async function setMinPlayers(minPlayers) {
  try {
    await contract.methods.setMinPlayers(minPlayers).send({ from: accounts[0] });
    log("Min players set to " + minPlayers);
  } catch (err) { log("setMinPlayers error: " + err.message); }
}

async function withdrawAllByOwnerPrompt() {
  const to = prompt("Enter address to withdraw all funds to:");
  if (to) withdrawAllByOwner(to);
}

async function withdrawAllByOwner(to) {
  try {
    await contract.methods.withdrawAllByOwner(to).send({ from: accounts[0] });
    log("Owner withdrew all funds to " + to);
  } catch (err) { log("withdrawAllByOwner error: " + err.message); }
}

// Player functions
async function buyTicket() {
  try {
    const price = await contract.methods.ticketPrice().call();
    await contract.methods.buyTicket().send({ from: accounts[0], value: price });
    log("Ticket bought!");
  } catch (err) { log("buyTicket error: " + err.message); }
}

async function checkMyTicket() {
  const has = await contract.methods.hasTicket(accounts[0]).call();
  log("You " + (has ? "have" : "do not have") + " a ticket.");
}

async function checkMyWinnings() {
  const win = await contract.methods.pendingWinnings(accounts[0]).call();
  log("Your pending winnings: " + web3.utils.fromWei(win, "ether") + " ETH");
}

async function withdrawPrize() {
  try {
    await contract.methods.withdrawPrize().send({ from: accounts[0] });
    log("Prize withdrawn!");
  } catch (err) { log("withdrawPrize error: " + err.message); }
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
  log("Winner: " + (winner === "0x0000000000000000000000000000000000000000" ? "none" : winner));
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

function clearLog() {
  const out = document.getElementById("output");
  if (out) out.innerText = "";
}

function log(msg) {
  console.log(msg);
  const output = document.getElementById("output");
  output.innerText += msg + "\n";
  output.scrollTop = output.scrollHeight;
}

window.addEventListener("DOMContentLoaded", () => {
  init();
});