## Investment Contract

In this exercise we're going to build an investment contract which allows a group of addresses to deposit DAI for an investment into ERC20 tokens. 

After all the deposits are completed, a `manager` address can choose to invest the Dai along a specific `path` to make the investment.

Finally, after a period of time, that same `manager` can divest into Dai; allowing those who deposited to withdraw their share of the resulting Dai (plus gains or minus losses).