## Exact Input Multihop 

Time to learn about multihop swaps! Specifically, we'll start with the **exact input** multihop, which will swap a fixed amount of a given input token for the maximum amount possible of a given output, and can include an arbitrary number of intermediary swaps.

How does it allow for those intermediary swaps? By encoding a `path`! The path looks something like this:

```solidity
// pack these values together to later be parsed by uniswap
bytes path = abi.encodePacked(DAI, poolFee, USDC, poolFee, WETH9);
```

<emoji id="point_up" /> In this case we're swapping between `DAI` and `WETH9` via the `USDC` pool. Notice that we have to encode the `poolFee` in the path here, because we need to designate exactly which pair we want to trade with. DAI <> USDC at 1% is a different pair than DAI <> USDC at .3%, so we need to be very specific! 

> <emoji id="technologist" /> See how Uniswap parses the path with its [Path library code](https://github.com/Uniswap/v3-periphery/blob/main/contracts/libraries/Path.sol).

Let's see an example using this multihop swap:

```solidity 
ISwapRouter.ExactInputParams memory params =
    ISwapRouter.ExactInputParams({
        path: abi.encodePacked(DAI, poolFee, USDC, poolFee, WETH9),
        recipient: msg.sender,
        deadline: block.timestamp,
        amountIn: amountIn,
        amountOutMinimum: 0
    });

amountOut = swapRouter.exactInput(params);
```

<emoji id="point_up" /> Most of these parameters should look quite familiar to you from the previous examples, especially `exactInputSingle`! The big change here is the `path`, which allows us to specify multiple hops in between the two pools. 

### <emoji id="checkered_flag" /> Your Goal: Hop from Dai to UNI <emoji id="rabbit" />

Let's execute a multihop trading all the Dai in this contract for UNI tokens. The test cases will provide the `path` as an argument to the `tradeDai` method, for you to use in the `ExactInputParams`. This path will bake in the full path from Dai to Weth to Uni so all you'll need to do is pass it as an argument!

Before calling the router, be sure to approve it to spend all of the contract's dai with `dai.approve`!

> <emoji id="book" /> Need more information? Check out the Uniswap [Multihop Swaps Documentation](https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps) and the [SwapRouter Documentation](https://docs.uniswap.org/protocol/reference/periphery/interfaces/ISwapRouter)!