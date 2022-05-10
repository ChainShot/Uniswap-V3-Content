## Swaps

Swaps are the most common interaction with the Uniswap protocol. In this tutorial we are going to be taking a look at the four different methods on the Swap Router contract. These four methods are:

- `swapExactInputSingle` - Swaps a specific amount of one token for as much as possible of another
- `swapExactOutputSingle` - Swaps as little as possible of one token for a specific amount out of another
- `exactInput` - It is like `swapExactInputSingle` with the ability to swap in multiple pools
- `exactOutput` - It is like `swapExactOutputSingle` with the ability to swap in multiple pools

The first two are considered [single swaps](https://docs.uniswap.org/protocol/guides/swaps/single-swaps) and the last two are considered [multihop swaps](https://docs.uniswap.org/protocol/guides/swaps/multihop-swaps). In this tutorial you'll be executing all four of these swaps and taking a look at the situations where you might want to use one over the other. 

Ready to begin coding? Let's jump in!