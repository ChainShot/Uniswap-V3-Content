## Withdraw 

Now that the contract has divested from its investment, its time to allow the shareholders to withdraw their funds. 

### <emoji id="checkered_flag" /> Your Goal: Withdrawal

Allow shareholders to come and withdraw their investments after the owner has moved back into Dai. 

When calculating how much the individual shareholder should receive we should follow this formula:

```
(share * endingDaiAmount) / initialDaiAmount
```

Where the `share` is the balance in the shares mapping for that adress, `endingDaiAmount` is the total Dai in the contract after divesting and `initialDaiAmount` is the total Dai in the contract before investing.