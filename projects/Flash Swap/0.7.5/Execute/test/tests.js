const { assert } = require("chai");
const { utils: { keccak256, hexZeroPad, parseEther, formatEther }, BigNumber } = ethers;

const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const LOW_FEE_POOL = "0x60594a405d53811d3bc4766596efd80fd545a270";
const MAX_SQRT_TICK = "1461446703485210103287273052203988822378723970342";

describe('LimitOrder', function () {
    const wethBalance = parseEther("750");
    let weth, contract, lowFeePool;
    let addr0;
    before(async () => {
        [addr0] = await ethers.provider.listAccounts();
        
        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy();
        await contract.deployed();

        weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);
        lowFeePool = await ethers.getContractAt("IUniswapV3Pool", LOW_FEE_POOL);

        await network.provider.send("hardhat_setStorageAt", [
            WETH_ADDR,
            keccak256(hexZeroPad(addr0, "32") + hexZeroPad("0x3", "32").slice(2)),
            hexZeroPad(wethBalance, "32")
        ]);

        await weth.approve(contract.address, wethBalance);
        await contract.push(wethBalance);
    });

    it("should", async () => {

    });
});