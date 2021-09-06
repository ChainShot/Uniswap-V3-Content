const getMinTick = (tickSpacing) => Math.ceil(-887272 / tickSpacing) * tickSpacing;
const getMaxTick = (tickSpacing) => Math.floor(887272 / tickSpacing) * tickSpacing;

async function addLiquidity(nftManager, recipient, token, weth, tokenAmount, wethAmount) {
    await token.approve(nftManager.address, tokenAmount);
    await weth.approve(nftManager.address, wethAmount);

    const mintParams = {
        token0: token.address,
        token1: weth.address,
        fee: 3000,
        tickLower: getMinTick(60),
        tickUpper: getMaxTick(60),
        recipient,
        amount0Desired: tokenAmount,
        amount1Desired: wethAmount,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60
    }

    return nftManager.mint(mintParams);
}

module.exports = addLiquidity;