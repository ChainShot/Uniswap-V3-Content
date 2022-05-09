// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract Contract {
	IERC20Minimal constant dai = IERC20Minimal(0x6B175474E89094C44Da98b954EedeAC495271d0F);
	IERC20Minimal constant weth = IERC20Minimal(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    ISwapRouter constant router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

	function addDai(uint amount) external {
		dai.transferFrom(msg.sender, address(this), amount);
	}
	
	function daiForWeth(uint wethAmount) external {
		uint balance = dai.balanceOf(address(this));

		dai.approve(address(router), balance);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams(
            address(dai),
            address(weth),
			3000,
			address(this),
			block.timestamp,
            wethAmount,
            balance,
			0
        );

        router.exactOutputSingle(params);
	}
}
