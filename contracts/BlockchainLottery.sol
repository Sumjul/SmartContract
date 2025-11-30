// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract BlockchainLottery {
    uint public ticketPrice;
    uint public minPlayers;
    address[] public players;
    address public owner;
    address public winner;
    bool public isActive = false;
    uint public totalWin;
    mapping(address => uint) public pendingRefunds;
    mapping(address => uint) public pendingWinnings;

    event TicketPurchased(address indexed buyer, uint indexed index, uint amount);
    event RefundAvailable(address indexed buyer, uint amount);
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
        require(msg.value >= ticketPrice, "Payment is too small");
        players.push(msg.sender);

        uint excess = msg.value - ticketPrice;
        if (excess > 0) {
            pendingRefunds[msg.sender] += excess;
            emit RefundAvailable(msg.sender, excess);
        }
        totalWin += ticketPrice;
        emit TicketPurchased(msg.sender, players.length - 1, ticketPrice);
    }

    function drawWinner() external onlyOwner lotteryActive {
        require(players.length >= minPlayers, "Not enough players in lottery");
        require(winner == address(0), "Winner already selected");

        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.number, players.length))) % players.length;
        winner = players[randomIndex];
        pendingWinnings[winner] += totalWin;
        emit PayoutPending(winner, totalWin);
        emit WinnerSelected(winner, totalWin);
        totalWin = 0;

        delete players;
        isActive = false;
        emit LotteryStopped(block.timestamp);
    }

    function withdrawPrize() external {
        uint refundAmount = pendingRefunds[msg.sender];
        if (refundAmount > 0) {
            pendingRefunds[msg.sender] = 0;
            (bool okR, ) = payable(msg.sender).call{value: refundAmount}("");
            require(okR, "Refund transfer failed");
            emit Withdrawn(msg.sender, refundAmount);
        }

        uint winAmount = pendingWinnings[msg.sender];
        require(winAmount > 0, "No winnings to withdraw");
        pendingWinnings[msg.sender] = 0;
        (bool okW, ) = payable(msg.sender).call{value: winAmount}("");
        require(okW, "Winning transfer failed");
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
        isActive = true;
        delete players;
        winner = address(0);
        emit LotteryStarted(ticketPrice, minPlayers, block.timestamp);
    }

    function stopLottery() external onlyOwner {
        require(isActive, "Lottery already stopped");
        isActive = false;
        emit LotteryStopped(block.timestamp);
        delete players;
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