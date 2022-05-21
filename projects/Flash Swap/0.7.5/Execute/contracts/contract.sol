// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";

contract Contract {
	IERC20Minimal weth = IERC20Minimal(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
	IUniswapV3Pool pool = IUniswapV3Pool(0x60594a405d53811d3BC4766596EFD80fd545A270);

	function push(uint amount) external {
		weth.transferFrom(msg.sender, address(this), amount);
		weth.approve(address(pool), amount);
		pool.swap(
            address(this),
            false,
            int(amount),
            TickMath.MAX_SQRT_RATIO - 1,
            ""
        );
	}

	function uniswapV3SwapCallback(int, int, bytes calldata) external {
		weth.transfer(msg.sender, 750 ether);
	}
}
