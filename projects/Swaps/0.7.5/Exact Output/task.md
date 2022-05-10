## Exact Output Multihop 

Ok, last swap API! Hope you have been enjoying the practice <emoji id="smiley" />

This example will be the `exactOutput` function, with the following parameters:

```solidity
ISwapRouter.ExactOutputParams({
    // The parameter path is encoded as (tokenOut, fee, tokenIn/tokenOut, fee, tokenIn)
    path: abi.encodePacked(WETH9, poolFee, USDC, poolFee, DAI),
    recipient: msg.sender,
    deadline: block.timestamp,
    amountOut: amountOut,
    amountInMaximum: amountInMaximum
});
```

<emoji id="point_up" /> Notice we make use of the `path` again, but this time we are specifying the output amount and providing a limit to the input amount. 

### <emoji id="checkered_flag" /> Your Goal: Hop from Dai to Uni <emoji id="rabbit" />

Time to hop from Dai to Uni again, except this time with `exactOutput`! There is an added challenge to this stage, as you will need to encode the path yourself! You can do so by taking a look at the example above to see how it is encoded to trade from DAI to WETH. You can use `3000` for the pool fee of both pools.

The test cases will provide the `outputAmount` of UNI, in this case, so that value can be supplied directly to the `amountOut`. 

Before calling the router, be sure to approve it to spend all of the contract's dai with `dai.approve`!

> <emoji id="book" /> Need more information? Check out the Uniswap [Multihop Swaps Documentation](https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps) and the [SwapRouter Documentation](https://docs.uniswap.org/protocol/reference/periphery/interfaces/ISwapRouter)!  