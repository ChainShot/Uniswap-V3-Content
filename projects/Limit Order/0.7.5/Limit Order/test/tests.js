const { assert, expect } = require("chai");
const { utils: { keccak256, hexZeroPad, parseEther, formatEther }, BigNumber } = ethers;
const { abi: routerAbi } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json');

const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const ROUTER_ADDR = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

describe('LimitOrder', function () {
    const wethBalance = parseEther("1500");
    const daiDeposit = parseEther("100");
    let contract, weth, dai;
    let addr0;
    let orderId;
    before(async () => {
        [addr0] = await ethers.provider.listAccounts();
        const LimitOrder = await ethers.getContractFactory("LimitOrder");
        contract = await LimitOrder.deploy();
        await contract.deployed();

        weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);
        dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);

        await network.provider.send("hardhat_setStorageAt", [
            WETH_ADDR,
            keccak256(hexZeroPad(addr0, "32") + hexZeroPad("0x3", "32").slice(2)),
            hexZeroPad(wethBalance, "32")
        ]);

        await network.provider.send("hardhat_setStorageAt", [
            DAI_ADDR,
            keccak256(hexZeroPad(addr0, "32") + hexZeroPad("0x2", "32").slice(2)),
            hexZeroPad(daiDeposit, "32")
        ]);

        await dai.approve(contract.address, daiDeposit);
        const tx = await contract.setLimitOrder(daiDeposit, Date.now(), 74000);
        const receipt = await tx.wait();
        const event = receipt.events.find(x => x.event === "NewOrder");
        if(!event) {
            throw new Error("No 'NewOrder' event emitted!");
        }
        orderId = event.args.id;
    });

    it("should have dai deposited", async () => {
        const balance = await dai.balanceOf(contract.address);
        assert.equal(balance.toString(), daiDeposit.toString());
    });

    it("should not allow the order to be executed", async () => {
        await expect(contract.executeOrder(orderId)).to.be.reverted;
    });

    describe("after moving the price significantly", () => {
        before(async () => {
            const router = await ethers.getContractAt(routerAbi, ROUTER_ADDR);

            await weth.approve(router.address, wethBalance);
            await router.exactInputSingle({
                tokenIn: WETH_ADDR,
                tokenOut: DAI_ADDR,
                fee: 3000,
                recipient: addr0,
                deadline: Math.ceil(Date.now() / 1000),
                amountIn: wethBalance,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0 
            });

            await hre.network.provider.send("evm_increaseTime", [10]); 
            await hre.network.provider.send("evm_mine"); 
        });

        it("should allow execution of the order", async () => {
            await contract.executeOrder(orderId);

            const daiBalance = await dai.balanceOf(contract.address);
            assert.equal(daiBalance.toString(), "0");

            const wethBalance = await weth.balanceOf(contract.address);
            assert(wethBalance.gt("0"));
        });
    });
});
