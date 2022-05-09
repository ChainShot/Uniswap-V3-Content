## Exact Output Single

Ok, time for a bit more practice! This method will feel quite similar to the last one. Be sure to take notice of the subtle difference in parameters! 

The `swapExactOutputSingle` function is for performing exact output swaps, which swap a minimum possible amount of one token for a fixed amount of another token. This function uses the `ExactOutputSingleParams` struct and the `exactOutputSingle` function from the `ISwapRouter` interface.

Ok, great! Let's check out another code example, then:

```solidity
ISwapRouter.ExactOutputSingleParams memory params =
    ISwapRouter.ExactOutputSingleParams({
        tokenIn: DAI,
        tokenOut: WETH9,
        fee: 3000,
        recipient: msg.sender,
        deadline: block.timestamp,
        amountOut: amountOut,
        amountInMaximum: amountInMaximum,
        sqrtPriceLimitX96: 0
    });

amountIn = swapRouter.exactOutputSingle(params);
```

<emoji id="point_up" >

### <emoji id="checkered_flag"> Your Goal: DAI to WETH

In your contract, there is already a method defined `addDai` which will pull Dai from the `msg.sender`. Now it's time to implement the `daiForWeth` which will take all Dai in the contract and transfer it to wrapped ether. 

For this challenge, make use of the swap router, dai and weth addresses defined as constants inside of the contract. You can set the `poolFee` to `3000` (which is a `0.3%` fee) and you can set the `amountOutMinimum` and `sqrtPriceLimitX96` to `0` as shown in the example above.

Before calling the router, be sure to approve it to spend all of the contract's dai with `dai.approve`!

> <emoji id="book" /> Need more information? Check out the Uniswap [Single Swaps Documentation](https://docs.uniswap.org/protocol/guides/swaps/single-swaps)!