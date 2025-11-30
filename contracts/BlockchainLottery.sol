// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract BlockchainLottery {
    uint public ticketPrice;
    uint public minPlayers;
    address[] public players;
    address public owner;
    address public winner;
    bool public isActive = true;
    mapping(address => uint) public pendingWithdraws;

    event TicketPurchased(address indexed buyer, uint indexed index, uint amount);
    event ExcessRefunded(address indexed buyer, uint amount);
    event Withdrawn(address indexed winner, uint amount);
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

    constructor(uint _ticketPrice, uint _minPlayers) {
        require(_ticketPrice > 0, "Ticket price must be > 0");
        require(_minPlayers > 0, "minPlayers must be > 0");
        owner = msg.sender;
        ticketPrice = _ticketPrice * 1 ether;
        minPlayers = _minPlayers;
        emit LotteryStarted(ticketPrice, minPlayers, block.timestamp);
    }

    function setTicketPrice(uint newPriceInEth) external onlyOwner {
        require(!isActive, "Stop lottery before changing ticket price");
        uint oldPrice = ticketPrice;
        ticketPrice = newPriceInEth * 1 ether;
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
        uint index = players.length - 1;

        uint excess = msg.value - ticketPrice;
        if (excess > 0) {
            (bool ok, ) = payable(msg.sender).call{value: excess}("");
            require(ok, "Refund failed");
            emit ExcessRefunded(msg.sender, excess);
        }
        emit TicketPurchased(msg.sender, index, ticketPrice);
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

    function drawWinner() external onlyOwner lotteryActive {
        require(players.length >= minPlayers, "Not enough players in lottery");
        require(winner == address(0), "Winner already selected");

        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, players.length))) % players.length;
        winner = players[randomIndex];

        uint prize = address(this).balance;
        pendingWithdraws[winner] += prize;
        emit PayoutPending(winner, prize);
        emit WinnerSelected(winner, prize);
        delete players;
        isActive = false;
    }

    function withdrawPrize() external {
        uint amount = pendingWithdraws[msg.sender];
        require(amount > 0, "No funds to withdraw");
        pendingWithdraws[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Withdraw transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function withdrawAllByOwner(address payable to) external onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Owner withdraw failed");
        emit Withdrawn(to, amount);
    }

    function stopLottery() external onlyOwner {
        isActive = false;
        emit LotteryStopped(block.timestamp);
    }

    function startLottery() external onlyOwner {
        isActive = true;
        delete players; 
        winner = address(0);
        emit LotteryStarted(ticketPrice, minPlayers, block.timestamp);
    }
}