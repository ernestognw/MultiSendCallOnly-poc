// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DefenderToken is ERC20 {
    constructor(address _owner) ERC20("DefenderToken", "MTK") {
        _mint(_owner, 1 * 10 ** 24);
    }
}
