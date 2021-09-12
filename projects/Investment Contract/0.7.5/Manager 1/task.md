## Investment Manager

Now that all the shareholders have a way to deposit their DAI, we need to have the investment `manager` invest the funds along a specified `path`. 

To begin with, let's make sure __only__ the investment manager can call this function. 

> <emoji id="face_with_monocle"/> While the `manager` is just a single address, it could be set as an Externally Owned Account or a more decentralized smart contract like a Multi-Sig or Governor contract.

### <emoji id="checkered_flag"> Your Goal: Manager Only

Ucomment the `invest` function and ensure that __only__ the manager can call it. If anyone else tries to call this function, revert the transaction.

> <emoji id="see_no_evil" /> For this stage its okay to ignore any unused parameter or mutability compiler warnings! We'll update this function in the next stage.