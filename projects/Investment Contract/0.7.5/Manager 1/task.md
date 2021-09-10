## Invest

Now that the DAI has been deposited, it is time to invest those funds into an ERC20 token! 

### <emoji id="checkered_flag"> Your Goal: Invest Along the Path

Uncomment and implement the `invest` function. This function should swap the DAI for an ERC20 following the `path` argument. 

In order to do so you will first need to `approve` the Dai to be spent. 

After that you will need to usw the `exactInput` function where:

- `path`: the token path passed in to the function
- `recipient`: our contract should receive the NFT position
- `deadline`: any future time as this will execute immediately, you can use `block.timestamp` here
- `amountIn`: the total amount of dai to be invested
- `amountOutMin`: this can be zero as we will not get front-run here
