const getMinTick = (tickSpacing) => Math.ceil(-887272 / tickSpacing) * tickSpacing;
const getMaxTick = (tickSpacing) => Math.floor(887272 / tickSpacing) * tickSpacing;

/**
 * Adds Liquidity to the Uniswap Token Pair
 * @param {ethers.Contract} nftManager - Uniswap V3 NonfungiblePositionManager
 * @param {string} recipient - Recipient of the NFT Position
 * @param {ethers.Contract} token0 - token0 to be added to the pool
 * @param {ethers.Contract} token1 - token1 to be added to the pool
 * @param {number} token0Amount - the amount of token0 to be added to the pool
 * @param {number} token1Amount - the amount of token1 to be added to the pool
 */
async function addLiquidity(nftManager, recipient, token0, token1, token0Amount, token1Amount) {
    await token0.approve(nftManager.address, token0Amount);
    await token1.approve(nftManager.address, token1Amount);

    return nftManager.mint({
        token0: token0.address,
        token1: token1.address,
        fee: 3000,
        tickLower: getMinTick(60),
        tickUpper: getMaxTick(60),
        recipient,
        amount0Desired: token0Amount,
        amount1Desired: token1Amount,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60
    });
}

module.exports = addLiquidity;