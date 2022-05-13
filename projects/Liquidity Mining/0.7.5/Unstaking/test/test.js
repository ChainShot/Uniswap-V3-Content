const { assert } = require("chai");
describe('TurtleFarm', function () {
    const ticks = [5, 10];
    let farm;
    beforeEach(async () => {
        const TurtleFarm = await ethers.getContractFactory("TurtleFarm");
        farm = await TurtleFarm.deploy(...ticks);
        await farm.deployed();
    });

    it('should store the ticks', async () => {
        const tickLower = await farm.tickLower();
        const tickUpper = await farm.tickUpper();
        assert.equal(tickLower, 5);
        assert.equal(tickUpper, 10);
    });
});
