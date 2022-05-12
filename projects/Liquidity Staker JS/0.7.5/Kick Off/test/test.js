const { assert } = require("chai");
const addLiquidity = require('./addLiquidity');
const createIncentive = require('../createIncentive');

const { parseEther } = ethers.utils;

const stakerAddress = "0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d";
const nonFungiblePositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

describe("Staker", function () {
    let incentiveId, staker, tokenId, incentiveKey, startTime;
    before(async () => {
        // 1. create two tokens
        const DummyToken = await ethers.getContractFactory('ERC20');

        const tokenA = await DummyToken.deploy(parseEther("10000"));
        await tokenA.deployed();

        const tokenB = await DummyToken.deploy(parseEther("1000"));
        await tokenB.deployed();

        // 2. create a pool of two tokens and mint a liquidity NFT on uni v3
        const response = await addLiquidity(tokenA, tokenB, "1000");
        const poolAddress = response.poolAddress;
        tokenId = response.tokenId;

        // 3. kick off the rewards program on staker
        const [addr1] = await ethers.provider.listAccounts();
        staker = await ethers.getContractAt("IUniswapV3Staker", stakerAddress);
        const block = await network.provider.send("eth_getBlockByNumber", ["latest", false]);
        startTime = Number(block.timestamp) + 1000;
        const tx = await createIncentive(staker, tokenA, poolAddress, startTime, addr1);
        const receipt = await tx.wait();

        const event = receipt.events.find(x => x.event === "IncentiveCreated");
        incentiveKey = {
            rewardToken: event.args.rewardToken,
            pool: event.args.pool,
            startTime: event.args.startTime,
            endTime: event.args.endTime,
            refundee: event.args.refundee
        }

        const IdHelper = await ethers.getContractFactory("IdHelper");
        const idHelper = await IdHelper.deploy();
        incentiveId = await idHelper.compute(incentiveKey);
    });

    it("should have created the rewards program", async function () {
        const { numberOfStakes } = await staker.incentives(incentiveId);
        assert.equal(numberOfStakes, 0);
    });

    describe("after staking", () => {
        before(async () => {
            const [addr1] = await ethers.provider.listAccounts();
            const abi = ["function safeTransferFrom(address,address,uint256) external"]
            const erc721 = await ethers.getContractAt(abi, nonFungiblePositionManagerAddress)
            await erc721['safeTransferFrom(address,address,uint256)'](addr1, staker.address, tokenId);
            await hre.network.provider.send("evm_setNextBlockTimestamp", [startTime]);
            await staker.stakeToken(incentiveKey, tokenId);
        });

        it("should have increased the stakers amount", async function () {
            const { numberOfStakes } = await staker.incentives(incentiveId);
            assert.equal(numberOfStakes, 1);
        });
    });
});