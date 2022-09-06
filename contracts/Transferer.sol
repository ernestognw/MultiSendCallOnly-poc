// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./DefenderToken.sol";

contract Transferer {
    DefenderToken public defenderToken;

    constructor() {
        defenderToken = new DefenderToken(msg.sender);
    }

    function transferSelf(uint256 amount) public {
        defenderToken.transferFrom(msg.sender, msg.sender, amount);
    }
}
