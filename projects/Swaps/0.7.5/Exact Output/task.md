## Exact Output Multihop 

Ok, last swap API! Hope you have been enjoying the practice <emoji id="smiley" />

This example will be the `exactOutput` function, with the following parameters:

```solidity
ISwapRouter.ExactOutputParams({
    path: abi.encodePacked(WETH9, poolFee, USDC, poolFee, DAI),
    recipient: msg.sender,
    deadline: block.timestamp,
    amountOut: amountOut,
    amountInMaximum: amountInMaximum
});
```

<emoji id="point_up" /> Notice we make use of the `path` again, but this time we are specifying the output amount and providing a limit to the input amount. 

### <emoji id="checkered_flag" /> Your Goal: Hop from Uni to WETH <emoji id="rabbit" />

We changed up the mission this time! In 

Before calling the router, be sure to approve it to spend all of the contract's dai with `dai.approve`!

> <emoji id="book" /> Need more information? Check out the Uniswap [Multihop Swaps Documentation](https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps)!