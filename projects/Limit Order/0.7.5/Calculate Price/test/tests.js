const { assert, expect } = require("chai");
const { utils: { keccak256, hexZeroPad, parseEther } } = ethers;
const { abi: routerAbi } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json');

const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const ROUTER_ADDR = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";

describe('LimitOrder', function () {
    const wethBalance = parseEther("1500");
    let contract, weth;
    let addr0;
    before(async () => {
        [addr0] = await ethers.provider.listAccounts();
        const LimitOrder = await ethers.getContractFactory("LimitOrder");
        contract = await LimitOrder.deploy();
        await contract.deployed();

        weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);

        await network.provider.send("hardhat_setStorageAt", [
            WETH_ADDR,
            keccak256(hexZeroPad(addr0, "32") + hexZeroPad("0x3", "32").slice(2)),
            hexZeroPad(wethBalance, "32")
        ]);
    });

    it("should calculate a price", async () => {
        const price = await contract.calculatePrice();
        assert.equal(price.toNumber(), 76344);
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

        it("should calculate a different price", async () => {
            const price = await contract.calculatePrice();
            assert.equal(price.toNumber(), 73653);
        });
    });
});
