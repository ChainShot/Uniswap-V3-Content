## Pool Flash

Uniswap V3 introduces a `flash` method on the [UniswapV3Pool](https://docs.uniswap.org/protocol/reference/core/UniswapV3Pool). This method allows anyone to borrow as many of either tokens in the pool as long as they pay it back, plus a fee, in the flash callback function. 

This means that if you spot a profitable opportunity on-chain the requires a significant amount of capital that you don't have, you can use this flash swap to seize the opportunity. Since this all happens with one transaction and requires no collateral, the only risk to you is that, if the transaction fails, you will have to pay the gas fee. 

Typically, these profitable opportunities come in the form of arbitrage. If you notice that two pools are out of sync you can profit by averaging them out. For instance, if the 0.05% ETH/DAI pool has the price of ETH at $1900 while the 0.3% ETH/DAI pool has the price of ETH at $2000, you would want to buy ETH from the pool where its cheaper and sell it into the more expensive pool. Doing this should result in your profit, and this will be exactly what you need to do in this next stage. For the current stage, let's first focus on the `flash` call and its callback.

### <emoji id="checkered_flag" /> Your Goal: Flash! 

In the `FlashSwap` contract you'll notice there's several hardcoded contracts and imported libraries. We'll make use of these, especially in the next stage. For now, you'll want to kick off a flash swap by borrowing funds from the `borrowPool`. The `borrowAmount` is the recommended amount to borrow in DAI, and you'll be able to adjust this in the next stage for experimentation. The `borrowPool` is a [0.01% DAI/USDC](https://etherscan.io/address/0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168#readContract) which contains over 200 million USDC and DAI tokens at the time at which the tests will be running your code (block 14757790).

To execute the flash loan, we'll make use of the [flash](https://docs.uniswap.org/protocol/reference/core/UniswapV3Pool#flash) method on the `borrowPool`. Be sure to make the `FlashSwap` contract the recipient of the funds. Borrow the `borrowAmount` in DAI. To figure out which token is DAI, check the `token0` and `token1` method on the [contract](https://etherscan.io/address/0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168#readContract) (`token0` is always the smaller of the two addresses, numerically). 

To pass this stage, you'll just need to kick off the flash callback. If you do so successfully, you'll see the `console.log` messages are logged in your execution results. The execution will fail because you will not have paid back the amount borrowed. The test cases expect this in order to pass the stage.