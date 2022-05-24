## Flash Swaps

Uniswap V3 provides a [flash function](https://docs.uniswap.org/protocol/reference/core/UniswapV3Pool#flash) on its pools that allow a contract to designate which tokens it would like to receive, and the pool will call back to the contract providing those tokens before it eventually enforces that the required outputs are received for the swap. 

This means the developer of the contract will have access to these tokens during the transaction's execution so long as they are able to pay back the tokens plus any additional fees. This allows a developer to be able to profit from opportunities that may require a great deal of upfront capital, without actually having that capital themselves. So the flow would look something like this:

- The developer's contract calls `flash` on the Uniswap pool
- The uniswap pool _optimistically_ calls the developer's contract back providing the tokens it requested
- The developer's contract can now do whatever it likes with those tokens so long as it pays them back plus a fee

If the tokens are not paid back in the last step, the whole transaction is reverted. This means that, as a developer, you can borrow as many tokens from the pool as you'd like and you only risk paying the gas fees if the transaction should revert. This is a very powerful tool for developers and can be extremely useful in capitalizing on arbitrage opportunities. That's exactly what we'll be looking at in this tutorial! Ready to get started? Let's jump in.