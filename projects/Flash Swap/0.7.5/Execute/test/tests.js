const { expect } = require("chai");

describe('FlashSwap', function () {
    let flashSwap;
    before(async () => {
        const FlashSwap = await ethers.getContractFactory("FlashSwap");
        flashSwap = await FlashSwap.deploy();
        await flashSwap.deployed();
    });

    it("should profit significantly in wrapped ether", async () => {
        // https://docs.uniswap.org/protocol/reference/error-codes
        await expect(flashSwap.execute()).to.be.revertedWith('F0');
    });
});