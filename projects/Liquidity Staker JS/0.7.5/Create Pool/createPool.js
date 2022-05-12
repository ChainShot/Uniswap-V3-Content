const encodePriceSqrt = require('./encodePriceSqrt');

async function createPool(poolInitializer, tokenAddress, wethAddress, tokenAmount, wethAmount) {
    if (tokenAddress.toLowerCase() < wethAddress.toLowerCase()) {
        return poolInitializer.createAndInitializePoolIfNecessary(
            tokenAddress,
            wethAddress,
            3000,
            encodePriceSqrt(wethAmount, tokenAmount)
        );
    }
    else {
        return poolInitializer.createAndInitializePoolIfNecessary(
            wethAddress,
            tokenAddress,
            3000,
            encodePriceSqrt(tokenAmount, wethAmount)
        );
    }
}

module.exports = createPool;