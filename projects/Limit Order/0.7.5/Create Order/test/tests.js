const { assert } = require("chai");
const { utils: { keccak256, hexZeroPad, parseEther } } = ethers;

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const ROUTER_ADDR = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

describe('LimitOrder', function () {
    const daiDeposit = parseEther("100");
    let contract, dai;
    let addr0;
    let orderId;
    before(async () => {
        [addr0] = await ethers.provider.listAccounts();
        const LimitOrder = await ethers.getContractFactory("LimitOrder");
        contract = await LimitOrder.deploy();
        await contract.deployed();

        dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);

        await network.provider.send("hardhat_setStorageAt", [
            DAI_ADDR,
            keccak256(hexZeroPad(addr0, "32") + hexZeroPad("0x2", "32").slice(2)),
            hexZeroPad(daiDeposit, "32")
        ]);

        await dai.approve(contract.address, daiDeposit);
        const tx = await contract.setLimitOrder(daiDeposit, Date.now(), 74000);
        const receipt = await tx.wait();
        const event = receipt.events.find(x => x.event === "NewOrder");
        if (!event) {
            throw new Error("No 'NewOrder' event emitted!");
        }
        orderId = event.args.id;
    });

    it("should have dai deposited", async () => {
        const balance = await dai.balanceOf(contract.address);
        assert.equal(balance.toString(), daiDeposit.toString());
    });

    it("should emit an order id", async () => {
        assert(orderId);
    });
});
