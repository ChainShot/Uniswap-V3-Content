const encodePriceSqrt = require('./encodePriceSqrt');

/**
 * Creates a TOKEN/WETH pair 
 * @param {ethers.Contract} poolInitializer - Uniswap V3 NonfungiblePositionManager
 * @param {string} tokenAddress - A token pair adress 
 * @param {string} wethAddress - A token pair address
 * @param {number} tokenAmount - An amount of tokens to be added
 * @param {number} wethAmount - An amount of weth tokens to be added
 */
async function createPool(poolInitializer, tokenAddress, wethAddress, tokenAmount, wethAmount) {

    return poolInitializer.createAndInitializePoolIfNecessary(
        // address token0, address token1, uint24 fee, uint160 sqrtPriceX96
    );
}

module.exports = createPool;