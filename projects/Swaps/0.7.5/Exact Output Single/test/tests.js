const { assert } = require("chai");

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

describe('Contract', function () {
    let dai, weth, addr1, contract, deposit;
    before(async () => {
        [addr1] = await ethers.provider.listAccounts();
        deposit = ethers.utils.parseEther("10000");
        await modifyDaiBalance(addr1, deposit);

        dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
        weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);

        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy();
        await contract.deployed();

        await dai.approve(contract.address, deposit);
        await contract.addDai(deposit);
    });

    it("should hold the ether initially", async () => {
        const balance = await dai.balanceOf(contract.address);
        assert(balance.eq(deposit));
    });

    describe("trading DAI for WETH", () => {
        const outputAmount = ethers.utils.parseEther("5");
        before(async () => {
            await contract.daiForWeth(outputAmount);
        });

        it("should still hold some dai", async () => {
            const balance = await dai.balanceOf(contract.address);
            assert(balance.gt(0));
        });

        it("should hold the expected weth amount", async () => {
            const balance = await weth.balanceOf(contract.address);
            assert(balance.eq(outputAmount));
        });
    });
});

async function modifyDaiBalance(addr, balance) {
    const storageSlot = ethers.utils.hexZeroPad(2, "32");
    const paddedAddr = ethers.utils.hexZeroPad(addr, "32");
    const slot = ethers.utils.keccak256(paddedAddr + storageSlot.slice(2));

    await network.provider.send("hardhat_setStorageAt", [
        DAI_ADDR,
        slot,
        ethers.utils.hexZeroPad(balance, "32")
    ]);
}
