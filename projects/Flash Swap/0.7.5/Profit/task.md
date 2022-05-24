## Arbitrage Profit

Ok, now it's time to execute on an **arbitrage opportunity**! In this stage, a **whale** (or someone with a whole bunch of ether) is going to trade 750 wrapped ether (WETH) for DAI using this [UniswapV3 0.05% ETH/DAI Pool](https://etherscan.io/address/0x60594a405d53811d3bc4766596efd80fd545a270). At the block when these tests are set to run, that is equivalent to roughly half of all the ether inside the pool. Naturally, this will have a significant effect on the price of the wrapped ether. 

> <emoji id="thinking_face" /> Before you look below, ask yourself, what will the effect of adding 750 WETH to this pool. Which token's value will go up and which token's value will go down?

If you said that WETH's value will decrease in the pool, you're correct! This is because there is now plenty more WETH and plenty less DAI in the pool, so their value relative to each other changes in this fashion. 

Now, as an arbitrageur, if we know that the price of WETH has gone down significantly, we can recognize this as a profit opportunity! Knowing that other pools have not adjusted yet, we can buy WETH from the pool that this whale sold their WETH to. This way we can scoop up some cheap WETH and sell it to a pool where the WETH is more expensive. The trick here, is we're going to use a flash loan to borrow 100k dai with which we can buy that cheap WETH to capitalize on this opportunity.

### <emoji id="checkered_flag" /> Your Goal: Capitalize! 

Its time to profit from this arbitrage opportunity! In the last stage you successfully called the `flash` which then has the pool call us back at `uniswapV3FlashCallback` with the tokens requested. Its during this callback that we will need to profit. Keep all profit in WETH to pass the test cases for this stage.

To accomplish the arbitrage you will need to swap your borrowed DAI into the 0.05% ETH/DAI pool to get back cheap WETH. Then we recommend you swap that cheap WETH into the 0.3% ETH/DAI pool to get the DAI you need to pay back the pool you borrowed from. For these swaps you can use the uniswap `router`. Be sure to approve the router to spend your tokens before trying to swap!

For the amount to be repayed to the pool, you will need to pay back everything you borrowed plus a 0.01% fee. This additional fee is provided as the first argument to the `uniswapV3FlashCallback` for you.

> <emoji id="book" /> This will be quite tricky! Be sure to use Hardhat's `console.log` ([documented here](https://hardhat.org/hardhat-network/reference/#console-log)) to log out the WETH and DAI balance of the contract as you make these swaps to keep track of what you have done successfully. Also, if you get a Uniswap error code, check this [reference](https://docs.uniswap.org/protocol/reference/error-codes) to see what it means. 