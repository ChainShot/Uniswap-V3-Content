// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "hardhat/console.sol";

contract Contract {
	IERC20Minimal constant dai = IERC20Minimal(0x6B175474E89094C44Da98b954EedeAC495271d0F);
	IERC20Minimal constant weth = IERC20Minimal(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
	IERC20Minimal constant uni = IERC20Minimal(0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984);
    ISwapRouter constant router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

	function addDai(uint amount) external {
		// transfers DAI to this contract
		dai.transferFrom(msg.sender, address(this), amount);
	}
	
	function tradeDai(uint outputAmount) external {
		// TODO: trade all DAI in this contract for WETH
		uint balance = dai.balanceOf(address(this));	

		int24 poolFee = 3000;
		dai.approve(address(router), balance);

        ISwapRouter.ExactOutputParams memory params =
            ISwapRouter.ExactOutputParams({
                path: abi.encodePacked(address(uni), poolFee, address(weth), poolFee, address(dai)),
                recipient: address(this),
                deadline: block.timestamp,
                amountOut: outputAmount,
                amountInMaximum: balance
            });

        router.exactOutput(params);
	}
}
