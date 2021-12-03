## Add Liquidity

Now that we have a pool, its time add some liquidity to the pool so that folks can trade against it.

### <emoji id="checkered_flag" /> Your Goal: Mint Position

Using the `mint` function on the `INonfungiblePositionManager` to create a new liquidity position on the pool. 

Here are some of the parameters:

- `token0`: Use the `token` address here
- `token1`: Use the wrapped ether address here
- `fee`: Use `3000` (which is .3%)
- `tickLower`: Find the min tick with a tick spacing of `60`
- `tickUpper`: Find the max tick with a tick spacing of `60`
- `recipient`: use the `recipient` parameter
- `amount0Desired`: should correspond with `token0` 
- `amount1Desured`: should correspond with `token1`
- `amount0Min`: You can set this to `0` since we are the first liquidity provider
- `amount1Min`: You can set this to `0` since we are the first liquidity provider
- `deadline`: any future time in seconds, use `Math.floor(Date.now() / 1000)` to get teh current time
