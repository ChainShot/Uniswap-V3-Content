const chai = require("chai");
const createPool = require('../createPool');
const { bytecode, abi } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json');
const { assert, expect } = chai;
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

const { parseEther } = ethers.utils;
const POOL_BYTECODE_HASH = ethers.utils.keccak256(bytecode);

const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const nonFungiblePositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

describe('createPool', function () {
    let weth, lessThanToken, greaterThanToken, poolInitializer;
    before(async () => {
        const ERC20 = await ethers.getContractFactory('ERC20');

        while (true) {
            const token = await ERC20.deploy(parseEther("10000"));
            if (token.address < WETH_ADDR) {
                lessThanToken = token;
            }
            else {
                greaterThanToken = token;
            }
            if (lessThanToken && greaterThanToken) break;
        }

        weth = await ethers.getContractAt("ERC20", WETH_ADDR);

        poolInitializer = await ethers.getContractAt("IPoolInitializer", nonFungiblePositionManagerAddress);
    });

    describe("with a token less than weth", () => {
        before(async () => {
            await createPool(
                poolInitializer,
                lessThanToken.address,
                weth.address,
                parseEther("100"),
                parseEther("10")
            );
        });

        it('should create a pool', async () => {
            const poolAddress = await computePoolAddress([lessThanToken.address, weth.address], 3000);
            const code = await ethers.provider.getCode(poolAddress);
            assert.notEqual(code, "0x", "A new 0.3% fee weth/token pool should be deployed");

            const pool = await ethers.getContractAt(abi, poolAddress);

            const tickSpacing = await pool.tickSpacing();
            assert.equal(tickSpacing, 60);

            const slot0 = await pool.slot0();
            const { sqrtPriceX96 } = slot0;
            const bigInt = sqrtPriceX96.mul(sqrtPriceX96).mul((1e18).toString()).toBigInt();
            const price = bigInt >> 96n * 2n;
            expect(ethers.BigNumber.from(price)).to.be.closeTo(ethers.utils.parseEther("10"), 1);
        });
    });

    describe("with a token greater than weth", () => {
        before(async () => {
            await createPool(
                poolInitializer,
                greaterThanToken.address,
                weth.address,
                parseEther("100"),
                parseEther("10")
            );
        });

        it('should create a pool', async () => {
            const poolAddress = await computePoolAddress([greaterThanToken.address, weth.address], 3000);
            const code = await ethers.provider.getCode(poolAddress);
            assert.notEqual(code, "0x", "A new 0.3% fee weth/token pool should be deployed");

            const pool = await ethers.getContractAt(abi, poolAddress);

            const tickSpacing = await pool.tickSpacing();
            assert.equal(tickSpacing, 60);

            const slot0 = await pool.slot0();
            const { sqrtPriceX96 } = slot0;
            const bigInt = sqrtPriceX96.mul(sqrtPriceX96).mul((1e18).toString()).toBigInt();
            const price = bigInt >> 96n * 2n;
            expect(ethers.BigNumber.from(price)).to.be.closeTo(ethers.utils.parseEther(".1"), 1);
        });
    });
});

function computePoolAddress([tokenA, tokenB], fee) {
    const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA]
    const constructorArgumentsEncoded = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'uint24'],
        [token0, token1, fee]
    )
    const create2Inputs = [
        '0xff',
        factoryAddress,
        // salt
        ethers.utils.keccak256(constructorArgumentsEncoded),
        // init code hash
        POOL_BYTECODE_HASH,
    ]
    const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join('')}`
    return ethers.utils.getAddress(`0x${ethers.utils.keccak256(sanitizedInputs).slice(-40)}`)
}
