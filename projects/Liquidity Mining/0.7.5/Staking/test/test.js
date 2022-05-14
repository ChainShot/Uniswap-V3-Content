const { assert } = require("chai");
const { utils: { parseEther, keccak256, hexZeroPad } } = ethers;
const { abi: factoryAbi } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");
const { abi: nftAbi } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json');
const { getMinTick, getMaxTick, encodePriceSqrt } = require('./utils');

const nonFungiblePositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const uniswapFactoryAddr = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

describe('TurtleFarm', function () {
    const ticks = [5, 10];
    let farm, turtle, nftManager;
    let acc0;
    let tokenId;
    before(async () => {
        [acc0] = await ethers.provider.listAccounts();

        const TurtleFarm = await ethers.getContractFactory("TurtleFarm");
        farm = await TurtleFarm.deploy(...ticks);
        await farm.deployed();

        const Turtle = await ethers.getContractFactory("Turtle");
        turtle = await Turtle.deploy(parseEther("1000"));
        await turtle.deployed();

        const poolInitializer = await ethers.getContractAt("IPoolInitializer", nonFungiblePositionManagerAddress);

        await poolInitializer.createAndInitializePoolIfNecessary(
            turtle.address,
            WETH_ADDR,
            3000,
            encodePriceSqrt(parseEther("100"), parseEther("100"))
        );

        // const receipt = await tx.wait();
        // const factoryInterface = new ethers.utils.Interface(factoryAbi);
        // const factoryEvents = receipt.logs.filter(x => x.address === uniswapFactoryAddr).map(x => factoryInterface.parseLog(x));
        // const { pool } = factoryEvents[0].args;

        nftManager = await ethers.getContractAt(nftAbi, nonFungiblePositionManagerAddress);
        const weth = await ethers.getContractAt("Turtle", WETH_ADDR);

        await network.provider.send("hardhat_setStorageAt", [
            WETH_ADDR,
            keccak256(hexZeroPad(acc0, "32") + hexZeroPad("0x3", "32").slice(2)),
            hexZeroPad(parseEther("10000"), "32")
        ]);

        await turtle.approve(nftManager.address, parseEther("100"));
        await weth.approve(nftManager.address, parseEther("100"));

        const tx2 = await nftManager.mint({
            token0: turtle.address,
            token1: weth.address,
            fee: 3000,
            tickLower: getMinTick(60),
            tickUpper: getMaxTick(60),
            recipient: acc0,
            amount0Desired: parseEther("100"),
            amount1Desired: parseEther("100"),
            amount0Min: 0,
            amount1Min: 0,
            deadline: Math.floor(Date.now() / 1000) + 60
        });
        const receipt2 = await tx2.wait();
        const increaseLiquidityEvent = receipt2.events.find(x => x.event === "IncreaseLiquidity");
        tokenId = increaseLiquidityEvent.args.tokenId;

        await nftManager['safeTransferFrom(address,address,uint256)'](acc0, farm.address, tokenId);
    });

    it('should store the ticks', async () => {
        const tickLower = await farm.tickLower();
        const tickUpper = await farm.tickUpper();
        assert.equal(tickLower, 5);
        assert.equal(tickUpper, 10);
    });

    it("should receive the NFT properly", async () => {
        assert(await nftManager.ownerOf(tokenId));
    });

    it("should store the deposit", async () => {
        const { timestamp, owner, liquidity } = await farm.deposits(tokenId);
        assert(timestamp.gt(0));
        assert.equal(owner, acc0);
        assert(liquidity.gt(0));
    });
});