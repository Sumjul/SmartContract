// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract BlockchainLottery {
    uint public ticketPrice;
    address[] public players;
    address public owner;
    bool public isActive = true;

    event TicketPurchased(address indexed buyer, uint indexed index, uint amount);
    event ExcessRefunded(address indexed buyer, uint amount);
    event Withdrawn(address indexed owner, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do this");
        _;
    }

    modifier lotteryActive() {
        require(isActive, "Lottery is not active");
        _;
    }

    constructor(uint TicketPriceInWei) {
        owner = msg.sender;
        ticketPrice = TicketPriceInWei;
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

    function withdrawOwner() external onlyOwner {
        uint amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "Withdraw failed");
        emit Withdrawn(owner, amount);
    }

    function stopLottery() external onlyOwner {
        isActive = false;
    }

    function startLottery() external onlyOwner {
        isActive = true;
        delete players;
    }
}