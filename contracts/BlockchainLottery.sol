// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract BlockchainLotteryStep1 {
    uint public ticketPrice;
    address[] public players;
    address public owner;

    event TicketPurchased(address indexed buyer, uint indexed index, uint amount);

    constructor(uint _ticketPriceWei) {
        owner = msg.sender;
        ticketPrice = _ticketPriceWei;
    }

    function buyTicket() external payable {
        require(msg.value == ticketPrice, "Incorrect payment amount");
        players.push(msg.sender);
        emit TicketPurchased(msg.sender, players.length - 1, msg.value);
    }

    function getPlayersCount() external view returns (uint) {
        return players.length;
    }

    function getPlayer(uint index) external view returns (address) {
        require(index < players.length, "Index out of range");
        return players[index];
    }
}