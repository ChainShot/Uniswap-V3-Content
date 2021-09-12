## Divestment Privilege 

The investment manager can now invest the Dai into any ERC20 along a path of their choosing. Similarly, we want to provide the ability for the manager to be able to __divest__ and move back into Dai for the shareholders to withdraw their initial share (plus gains or minus losses).

### <emoji id="checkered_flag"> Your Goal: Manager Only

Ucomment the `divest` function and ensure that __only__ the manager can call it. If anyone else tries to call this function, revert the transaction.

> <emoji id="see_no_evil" /> For this stage its okay to ignore any unused parameter or mutability compiler warnings! We'll update this function in the next stage.