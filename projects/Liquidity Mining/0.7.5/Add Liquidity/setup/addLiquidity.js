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
    // TODO: approve both token0 and token1

    // TODO: fill in token addresses and amounts
    return nftManager.mint({
        // token0: 
        // token1: 
        fee: 3000,
        tickLower: getMinTick(60),
        tickUpper: getMaxTick(60),
        recipient,
        // amount0Desired: 
        // amount1Desired: 
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60
    });
}

module.exports = addLiquidity;