async function createPool(poolInitializer, tokenAddress, wethAddress, tokenAmount, wethAmount) {
    if (tokenAddress.toLowerCase() < wethAddress.toLowerCase()) {
        return poolInitializer.createAndInitializePoolIfNecessary(
            tokenAddress,
            wethAddress,
            3000,
            encodePriceSqrt(tokenAmount, wethAmount)
        );
    }
    else {
        return poolInitializer.createAndInitializePoolIfNecessary(
            wethAddress,
            tokenAddress,
            3000,
            encodePriceSqrt(wethAmount, tokenAmount)
        );
    }
}

const bn = require("ganache-core/node_modules/bignumber.js");
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
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

module.exports = createPool;