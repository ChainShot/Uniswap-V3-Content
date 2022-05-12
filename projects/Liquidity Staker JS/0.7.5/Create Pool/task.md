## Create Pool

Now that we have created a token, its time to initialize a pool where we can incentivize users to provide liquidity! 

### <emoji id="checkered_flag" /> Your Goal: Initialize Pool

On the `poolInitializer` contract you will find a `createAndInitializePoolIfNecessary` function (documented [here](https://docs.uniswap.org/protocol/reference/periphery/base/PoolInitializer#createandinitializepoolifnecessary)) which will allow us to initialize a pool with two tokens, a set trading fee, and a token price. Call this function to create a pool between your token and Wrapped Ether.

The token order **does matter here**! Uniswap requires that the first token is the one with the **lower address**. Compare the two addresses before calling the function, you can compare them like this:

```js
address1.toLowerCase() < address2.toLowerCase()
```

The smaller one should be first.