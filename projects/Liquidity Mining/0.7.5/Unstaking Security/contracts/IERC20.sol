// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";

interface IERC20 is IERC20Minimal {
    function mint(address to, uint256 amount) external;
}