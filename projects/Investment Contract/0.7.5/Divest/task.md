## Divest

After a period of time, it will become necessary to divest from the ERC20 token. When it is time to do so the `owner` will be allowed to move the funds back into Dai.

### <emoji id="checkered_flag" /> Your Goal: Back to Dai

Uncomment the `divest` function and implement it. First you will need to `approve` the transfer of the asset the contract is currently invested in. To get the address of this asset, you can use the `BytesLib.toAddress` method. The first value in the path will be the asset.

Once you have approved the asset to be spent, you can once again use the `exactInput` arguments to swap along the `path` passed in to go back to Dai.