const { assert, expect } = require("chai");
const { utils: { formatEther, parseEther, keccak256, hexZeroPad } } = ethers;
const { abi: nftAbi } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json');
const { getMinTick, getMaxTick, encodePriceSqrt, mintLiquidity, createPool } = require('./utils');

const nonFungiblePositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

describe('TurtleFarm', function () {
    const ticks = [getMinTick(60), getMaxTick(60)];
    const amounts = [parseEther("100"), parseEther("100")];
    let farm, turtle, weth, nftManager;
    let acc0;
    let tokenId;
    before(async () => {
        [acc0] = await ethers.provider.listAccounts();

        const TurtleFarm = await ethers.getContractFactory("TurtleFarm");
        farm = await TurtleFarm.deploy(...ticks);
        await farm.deployed();

        const Turtle = await ethers.getContractFactory("Turtle");
        turtle = await Turtle.deploy(parseEther("100"));
        await turtle.deployed();

        await createPool(nonFungiblePositionManagerAddress, turtle.address, WETH_ADDR, 3000, amounts[0], amounts[1]);

        await turtle.transferOwnership(farm.address);

        nftManager = await ethers.getContractAt(nftAbi, nonFungiblePositionManagerAddress);
        weth = await ethers.getContractAt("Turtle", WETH_ADDR);

        await network.provider.send("hardhat_setStorageAt", [
            WETH_ADDR,
            keccak256(hexZeroPad(acc0, "32") + hexZeroPad("0x3", "32").slice(2)),
            hexZeroPad(parseEther("10000"), "32")
        ]);

        tokenId = await mintLiquidity(turtle, weth, amounts[0], amounts[1], nftManager, acc0);

        await nftManager['safeTransferFrom(address,address,uint256)'](acc0, farm.address, tokenId);
    });

    it('should store the ticks', async () => {
        const tickLower = await farm.tickLower();
        const tickUpper = await farm.tickUpper();
        assert.equal(tickLower, ticks[0]);
        assert.equal(tickUpper, ticks[1]);
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

    describe("unstaking after some time has passed", () => {
        const time = 1000;
        const rate = 150;
        before(async () => {
            const block = await ethers.provider.getBlock();
            await hre.network.provider.request({
                method: "evm_setNextBlockTimestamp",
                params: [block.timestamp + time],
            }); 
            await farm.unstake(tokenId);
        });

        it("should mint tokens by rate * time", async () => {
            const { liquidity } = await nftManager.positions(tokenId);
            const balance = await turtle.balanceOf(acc0);
            assert.equal(balance.toString(), liquidity.mul(time * rate).toString());
        })
    });
});