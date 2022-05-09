## Exact Input Single

The `swapExactInputSingle` function is for performing exact input swaps, which swap a fixed amount of one token for a maximum possible amount of another token. This function uses the `ExactInputSingleParams` struct and the `exactInputSingle` function from the `ISwapRouter` interface.

Let's see a code example! 

```solidity
// First we create an ExactInputSingleParams struct
ISwapRouter.ExactInputSingleParams memory params =
    ISwapRouter.ExactInputSingleParams({
        tokenIn: DAI,
        tokenOut: WETH9,
        fee: 3000,
        recipient: msg.sender,
        deadline: block.timestamp,
        amountIn: amountIn,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    });

// then we pass those params to the router 
amountOut = swapRouter.exactInputSingle(params);
```

> <emoji id="face_with_monocle" />  Notice that the `amountOutMinimum` and `sqrtPriceLimitX96` price are set to `0` here. In production, you'll want to set these values to protect against price impact and manipulation.

### <emoji id="checkered_flag"> Your Goal: DAI to WETH

In your contract, there is already a method defined `addDai` which will pull Dai from the `msg.sender`. Now it's time to implement the `daiForWeth` which will take all Dai in the contract and transfer it to wrapped ether. 

For this challenge, make use of the swap router, dai and weth addresses defined as constants inside of the contract. You can set the `poolFee` to `3000` (which is a `0.3%` fee) and you can set the `amountOutMinimum` and `sqrtPriceLimitX96` to `0` as shown in the example above.

Before calling the router, be sure to approve it to spend all of the contract's dai with `dai.approve`!

> <emoji id="book" /> Need more information? Check out the Uniswap [Single Swaps Documentation](https://docs.uniswap.org/protocol/guides/swaps/single-swaps)!