const { abi: factoryAbi } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");
const bn = require("ganache-core/node_modules/bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const uniswapFactoryAddr = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const getMinTick = (tickSpacing) => Math.ceil(-887272 / tickSpacing) * tickSpacing;
const getMaxTick = (tickSpacing) => Math.floor(887272 / tickSpacing) * tickSpacing;

function encodePriceSqrt(reserve1, reserve0) {
    return ethers.BigNumber.from(
        new bn(reserve1.toString())
            .div(reserve0.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString()
    )
}


async function createPool(poolInitializerAddr, token0Addr, token1Addr, fee, amount0, amount1) {
    const poolInitializer = await ethers.getContractAt("IPoolInitializer", poolInitializerAddr);

    await poolInitializer.createAndInitializePoolIfNecessary(
        token0Addr,
        token1Addr,
        fee,
        encodePriceSqrt(amount0, amount1)
    );

    // const receipt = await tx.wait();
    // const factoryInterface = new ethers.utils.Interface(factoryAbi);
    // const factoryEvents = receipt.logs.filter(x => x.address === uniswapFactoryAddr).map(x => factoryInterface.parseLog(x));
    // const { pool } = factoryEvents[0].args;
}

async function mintLiquidity(token0, token1, amount0, amount1, nftManager, recipient, fee = 3000, tickLower = getMinTick(60), tickUpper = getMaxTick(60)) {
    await token0.approve(nftManager.address, amount0);
    await token1.approve(nftManager.address, amount1);

    const tx2 = await nftManager.mint({
        token0: token0.address,
        token1: token1.address,
        fee,
        tickLower,
        tickUpper,
        recipient,
        amount0Desired: amount0,
        amount1Desired: amount1,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60
    });

    const receipt2 = await tx2.wait();
    const increaseLiquidityEvent = receipt2.events.find(x => x.event === "IncreaseLiquidity");
    const tokenId = increaseLiquidityEvent.args.tokenId;
    return tokenId;
}

module.exports = {
    getMaxTick,
    getMinTick,
    encodePriceSqrt,
    createPool,
    mintLiquidity
}