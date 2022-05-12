## Incentive Token

Creators of a token often want to give incentives for people to provide liquidity, so that way their token is liquid enough to have good trading volume. 

They will do this by creating their token and then providing liquidity incentives, which is often referred to as liquidity mining. 

### <emoji id="checkered_flag" /> Your Goal: Create a Token

Let's create a token using OpenZeppelin's ERC20 implementation. 

Provide the `name` and `symbol` for your token and then mint the supply to the `msg.sender` by using the internal, inherited `_mint` function.