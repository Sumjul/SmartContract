// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract BlockchainLottery {
    uint public ticketPrice;
    uint public minPlayers;
    address[] public players;
    address public owner;
    address public winner;
    bool public isActive = false;
    uint public totalPot;

    mapping(address => uint) public pendingWinnings;
    mapping(address => bool) public hasTicket;

    event TicketPurchased(address indexed buyer, uint indexed index, uint amount);
    event Withdrawn(address indexed recipient, uint amount);
    event WinnerSelected(address indexed winner, uint amount);
    event LotteryStarted(uint ticketPrice, uint minPlayers, uint timestamp);
    event LotteryStopped(uint timestamp);
    event TicketPriceChanged(uint oldPrice, uint newPrice, uint timestamp);
    event PayoutPending(address indexed winner, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do this");
        _;
    }

    modifier lotteryActive() {
        require(isActive, "Lottery is not active");
        _;
    }

    constructor(uint _ticketPriceInWei, uint _minPlayers) {
        require(_ticketPriceInWei > 0, "Ticket price must be > 0");
        require(_minPlayers > 0, "minPlayers must be > 0");
        owner = msg.sender;
        ticketPrice = _ticketPriceInWei;
        minPlayers = _minPlayers;
    }

    function setTicketPrice(uint newPriceInWei) external onlyOwner {
        require(!isActive, "Stop lottery before changing ticket price");
        uint oldPrice = ticketPrice;
        ticketPrice = newPriceInWei;
        emit TicketPriceChanged(oldPrice, ticketPrice, block.timestamp);
    }

    function setMinPlayers(uint _minPlayers) external onlyOwner {
        require(_minPlayers > 0, "minPlayers must be > 0");
        minPlayers = _minPlayers;
    }

    function buyTicket() external payable lotteryActive {
        require(msg.sender != owner, "Owner cannot buy tickets");
        require(msg.value == ticketPrice, "Send exact ticket price");

        require(!hasTicket[msg.sender], "You already bought a ticket");
        hasTicket[msg.sender] = true;

        players.push(msg.sender);
        totalPot += msg.value;

        emit TicketPurchased(msg.sender, players.length - 1, ticketPrice);
    }

    function drawWinner() external onlyOwner lotteryActive {
        require(players.length >= minPlayers, "Not enough players in lottery");
        require(winner == address(0), "Winner already selected");

        uint randomIndex = uint(
            keccak256(abi.encodePacked(block.timestamp, block.number, players.length))
        ) % players.length;

        winner = players[randomIndex];
        pendingWinnings[winner] = totalPot;

        emit PayoutPending(winner, totalPot);
        emit WinnerSelected(winner, totalPot);

        totalPot = 0;
        for (uint i = 0; i < players.length; i++) {
            hasTicket[players[i]] = false;
        }

        delete players;
        isActive = false;
        emit LotteryStopped(block.timestamp);
    }

    function withdrawPrize() external {
        uint winAmount = pendingWinnings[msg.sender];
        require(winAmount > 0, "No winnings to withdraw");

        pendingWinnings[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: winAmount}("");
        require(ok, "Transfer failed");

        emit Withdrawn(msg.sender, winAmount);

        if (msg.sender == winner) {
            winner = address(0);
        }
    }

    function withdrawAllByOwner(address payable to) external onlyOwner {
        require(!isActive, "Stop lottery before owner withdraw");
        require(winner == address(0), "Cannot withdraw: payout pending or winner exists");

        uint amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Owner withdraw failed");

        emit Withdrawn(to, amount);
    }

    function startLottery() external onlyOwner {
        require(!isActive, "Lottery already active");
        require(winner == address(0), "Clear previous winner before starting");

        isActive = true;
        delete players;
        totalPot = 0;
    }

    function stopLottery() external onlyOwner {
        require(isActive, "Lottery already stopped");

        isActive = false;
        for (uint i = 0; i < players.length; i++) {
            hasTicket[players[i]] = false;
        }
        delete players;
        totalPot = 0;

        emit LotteryStopped(block.timestamp);
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }

    function getPlayersCount() external view returns (uint) {
        return players.length;
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getStatus() external view returns (
        bool active,
        uint price,
        uint minP,
        uint playersCount,
        address currentWinner
    ) {
        active = isActive;
        price = ticketPrice;
        minP = minPlayers;
        playersCount = players.length;
        currentWinner = winner;
    }
}