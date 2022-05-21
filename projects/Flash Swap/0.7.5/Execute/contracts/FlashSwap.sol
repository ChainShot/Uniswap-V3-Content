// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";

import "hardhat/console.sol";

contract FlashSwap {
	IERC20Minimal weth = IERC20Minimal(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
	IUniswapV3Pool ethDai500 = IUniswapV3Pool(0x60594a405d53811d3BC4766596EFD80fd545A270);
	IUniswapV3Pool ethDai3000 = IUniswapV3Pool(0xC2e9F25Be6257c210d7Adf0D4Cd6E3E881ba25f8);

	function execute() external {
		ethDai3000.flash(address(this), 100000e18, 0, "0xabcd");
	}

	function uniswapV3FlashCallback(uint, uint, bytes calldata) external {
		console.log("callback!");
	}
}
