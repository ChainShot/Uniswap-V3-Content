const getMinTick = (tickSpacing) => Math.ceil(-887272 / tickSpacing) * tickSpacing;
const getMaxTick = (tickSpacing) => Math.floor(887272 / tickSpacing) * tickSpacing;

async function addLiquidity(nftManager, token, weth, tokenAmount, wethAmount) {

}

module.exports = addLiquidity;