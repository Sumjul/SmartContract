// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Test {
    uint public number;

    function setNumber(uint _num) public {
        number = _num;
    }
}