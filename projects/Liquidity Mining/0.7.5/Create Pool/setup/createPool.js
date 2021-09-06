const bigIntSqrt = require('./bigIntSqrt');

async function createPool(poolInitializer, tokenAddress, wethAddress, tokenAmount, wethAmount) {
    
}

function encodePriceSqrt(reserve1, reserve0) {
    return bigIntSqrt(BigInt(reserve1) / BigInt(reserve0)) * (2n ** 96n);
}

module.exports = createPool;