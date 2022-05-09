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

<emoji id="point_up"> You should notice two big changes above. Instead of a specific `amountIn`, we have a specific `amountOut`. _And_ instead of a limited `amountOutMinimum` we have a limited `amountInMaximum`. 

> <emoji id="thinking_face" /> At this point, its useful to ask yourself, "When might this method be preferable?". Try to think of some situations where you might know the exact `amountOut` that you need.

### <emoji id="checkered_flag"> Your Goal: Dai for Weth (again!)

Same goal as the last stage, let's swap Dai for wrapped ether! Except this time there's a bit of a twist. We'll pass in a `uint` parameter to the `daiForWeth` function which is the exact amount of wrapped ether we want to get from uniswap. 

Before calling the router, be sure to approve it to spend all of the contract's dai with `dai.approve`!

> <emoji id="book" /> Need more information? Check out the Uniswap [Single Swaps Documentation](https://docs.uniswap.org/protocol/guides/swaps/single-swaps)!