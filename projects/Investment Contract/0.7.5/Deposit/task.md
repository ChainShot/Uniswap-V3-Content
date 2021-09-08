## Deposit

It's time to deposit DAI into the contract! 

### <emoji id="checkered_flag"> Your Goal: Adjust Shares

Allow anyone to deposit DAI into the contract, assuming that they have already **approved** the `_amount` in DAI before calling this `deposit` function. 

Once the dai has been successfully transferred, adjust the `share` mapping to keep track of the amount of dai deposited by this address.