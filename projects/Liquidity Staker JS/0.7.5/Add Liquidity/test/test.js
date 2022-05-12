const chai = require("chai");
const { abi } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json');
const { abi: nftAbi } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json');
const { assert, expect } = chai;
const { solidity } = require("ethereum-waffle");
const encodePriceSqrt = require("../encodePriceSqrt");
const addLiquidity = require('../addLiquidity');
const computePoolAddress = require('../computePoolAddress');
const getWeth = require('./getWeth');

chai.use(solidity);

const { parseEther } = ethers.utils;

const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const nonFungiblePositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

describe('addLiquidity', function () {
    let weth, token;
    const tokenAmount = ethers.utils.parseEther("100");
    const wethAmount = ethers.utils.parseEther("10");
    before(async () => {
        const ERC20 = await ethers.getContractFactory('ERC20');
        token = await ERC20.deploy(parseEther("10000"));
        weth = await ethers.getContractAt("ERC20", WETH_ADDR);
        poolInitializer = await ethers.getContractAt("IPoolInitializer", nonFungiblePositionManagerAddress);

        while (true) {
            token = await ERC20.deploy(parseEther("10000"));
            if (token.address < WETH_ADDR) break;
        }

        await poolInitializer.createAndInitializePoolIfNecessary(
            token.address,
            weth.address,
            3000,
            encodePriceSqrt(tokenAmount, wethAmount)
        );

        const nftManager = await ethers.getContractAt(nftAbi, nonFungiblePositionManagerAddress);

        const [acct1] = await ethers.provider.listAccounts();
        await getWeth(weth, [acct1]);
        await addLiquidity(nftManager, acct1, token, weth, tokenAmount, wethAmount);
    });

    it("should have liquidity", async () => {
        const poolAddress = await computePoolAddress([token.address, weth.address], 3000);

        const pool = await ethers.getContractAt(abi, poolAddress);

        const liquidity = await pool.liquidity();

        assert(liquidity.gt(0));
    });
});