// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import "hardhat/console.sol";

contract FlashSwap {
	IUniswapV3Pool constant borrowPool = IUniswapV3Pool(0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168);
    ISwapRouter constant router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
	IERC20Minimal constant weth = IERC20Minimal(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
	IERC20Minimal constant dai = IERC20Minimal(0x6B175474E89094C44Da98b954EedeAC495271d0F);

	uint constant borrowAmount = 100000e18;
	
	function execute() external {

	}

	function uniswapV3FlashCallback(uint, uint, bytes calldata) external {
		console.log("inside the flash swap callback!");
		// should have borrowed the 100k dai
		console.log(dai.balanceOf(address(this)));
	}
}
