// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract LimitOrder {
	IERC20Minimal constant dai = IERC20Minimal(0x6B175474E89094C44Da98b954EedeAC495271d0F);
	IUniswapV3Pool constant pool = IUniswapV3Pool(0xC2e9F25Be6257c210d7Adf0D4Cd6E3E881ba25f8);
	ISwapRouter constant router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);


	function setLimitOrder(uint amount, uint expiration, uint ethPrice) external {
		dai.transferFrom(msg.sender, address(this), amount);
	}
}
