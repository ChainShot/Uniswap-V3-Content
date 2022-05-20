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

	struct Order {
		uint amount;
		uint expiration;
		uint ethPrice;
	}
	
	uint orderIdCount;
	mapping(uint => Order) orders;

	function depositDai(uint amount) external {
		dai.transferFrom(msg.sender, address(this), amount);
	}

	event NewOrder(uint id);

	function setLimitOrder(uint amount, uint expiration, uint ethPrice) external {
		dai.transferFrom(msg.sender, address(this), amount);
		orderIdCount++;
		orders[orderIdCount] = Order(amount, expiration, ethPrice);
		emit NewOrder(orderIdCount);
	}
	
	function calculatePrice() public view returns(uint) {
		uint32[] memory secondsAgos = new uint32[](2);
        secondsAgos[0] = 10;
        secondsAgos[1] = 0;
		(int56[] memory tickCumulatives, ) = pool.observe(secondsAgos);
		int56 diff = tickCumulatives[1] - tickCumulatives[0];
		diff = diff > 0 ? diff : -diff;
		return uint(diff) / 10;
	}

	function executeOrder(uint orderId) external {
		Order memory order = orders[orderId];

		require(block.timestamp < order.expiration);
		require(calculatePrice() < order.ethPrice); 

		dai.approve(address(router), order.amount);

		ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: pool.token0(),
                tokenOut: pool.token1(),
                fee: pool.fee(),
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: order.amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        router.exactInputSingle(params);
	}
}
