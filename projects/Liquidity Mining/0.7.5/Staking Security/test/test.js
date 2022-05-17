const { assert, expect } = require("chai");
const { utils: { parseEther, keccak256, hexZeroPad } } = ethers;
const { abi: nftAbi } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json');
const { getMinTick, getMaxTick, encodePriceSqrt, mintLiquidity, createPool } = require('./utils');

const nonFungiblePositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

describe('TurtleFarm', function () {
    const ticks = [getMinTick(60), getMaxTick(60)];
    const amounts = [parseEther("100"), parseEther("100")];
    let farm, turtle, weth, nftManager;
    let acc0, acc1;
    let signer1;
    let tokenId;
    before(async () => {
        [, signer1] = await ethers.getSigners();
        [acc0, acc1] = await ethers.provider.listAccounts();

        const TurtleFarm = await ethers.getContractFactory("TurtleFarm");
        farm = await TurtleFarm.deploy(...ticks);
        await farm.deployed();

        const Turtle = await ethers.getContractFactory("Turtle");
        turtle = await Turtle.deploy(parseEther("1000"));
        await turtle.deployed();

        await createPool(nonFungiblePositionManagerAddress, turtle.address, WETH_ADDR, 3000, amounts[0], amounts[1]);

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

    describe("security concerns", () => {
        describe("a transfer from a non position manager", () => {
            let newTokenId;
            before(async () => {
                await turtle.transfer(acc1, parseEther("1"));
                await weth.transfer(acc1, parseEther("1"));
                newTokenId = await mintLiquidity(turtle.connect(signer1), weth.connect(signer1), parseEther("1"), parseEther("1"), nftManager.connect(signer1), acc1);
            });

            it("should revert", async () => {
                const transfer = farm.onERC721Received(acc0, acc0, newTokenId, "");
                await expect(transfer).to.be.reverted;
            });
        });

        describe("an nft with the wrong ticks", () => {
            let newTokenId;
            before(async () => {
                newTokenId = await mintLiquidity(turtle, weth, parseEther("1"), parseEther("1"), nftManager, acc0, 3000, getMinTick(60) + 60, getMaxTick(60) - 60);
            });

            it("should revert", async () => {
                const transfer = nftManager['safeTransferFrom(address,address,uint256)'](acc0, farm.address, newTokenId);
                await expect(transfer).to.be.reverted;
            });
        });

        describe("an nft in the wrong pool", () => {
            let newTokenId;
            before(async () => {
                const Turtle = await ethers.getContractFactory("Turtle");
                const fakeTurtle = await Turtle.deploy(parseEther("1000"));
                await fakeTurtle.deployed();

                await createPool(nonFungiblePositionManagerAddress, fakeTurtle.address, WETH_ADDR, 3000, amounts[0], amounts[1]);

                newTokenId = await mintLiquidity(fakeTurtle, weth, parseEther("1"), parseEther("1"), nftManager, acc0);
            });

            it("should revert", async () => {
                const transfer = nftManager['safeTransferFrom(address,address,uint256)'](acc0, farm.address, newTokenId);
                await expect(transfer).to.be.reverted;
            });
        });
    });
});