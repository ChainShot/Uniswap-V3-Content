## Parameter Documentation

```solidity
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
```

- **tokenIn**: The contract address of the inbound token
- **tokenOut**: The contract address of the outbound token
- **fee**: The fee tier of the pool, used to determine the correct pool contract in which to execute the swap
- **recipient**: the destination address of the outbound token
- **deadline**: the [unix time](https://en.wikipedia.org/wiki/Unix_time) after which a swap will fail, to protect against long-pending transactions and wild swings in prices
- **amountIn**: the exact amount of tokens we are sending into this trade
- **amountOutMinimum**: we are setting to zero, but this is a significant risk in production. For a real deployment, this value should be calculated using our SDK or an onchain price oracle - this helps protect against getting an unusually bad price for a trade due to a front running sandwich or another type of price manipulation
- **sqrtPriceLimitX96**: We set this to zero - which makes this parameter inactive. In production, this value can be used to set the limit for the price the swap will push the pool to, which can help protect against price impact or for setting up logic in a variety of price-relevant mechanisms.

> <emoji id="thinking_face" /> After reading this documentation, ask yourself "Why doesn't uniswap just have a method for swapping an exact amount of X token for an exact amount of Y token?"