const { assert } = require("chai");
describe('Token', function () {
    const totalSupply = ethers.utils.parseEther("1000");
    let contract;
    beforeEach(async () => {
        const Token = await ethers.getContractFactory("MyToken");
        contract = await Token.deploy(totalSupply);
        await contract.deployed();
    });

    it('should mint the supply to the owner', async () => {
        const [acct1] = await ethers.provider.listAccounts();
        const balance = await contract.balanceOf(acct1);
        assert(totalSupply.eq(balance));
    });
});
