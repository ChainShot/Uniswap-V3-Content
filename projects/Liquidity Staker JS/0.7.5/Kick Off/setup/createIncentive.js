const incentiveAmount = ethers.utils.parseEther("9000");

/**
 * Creates a staking incentive for liquidity providers
 * @param {ethers.Contract} staker - The UniswapV3 Staker Contract
 * @param {ethers.Contract} token - The Reward Token Contract
 * @param {string} poolAddress - The address of Uniswap Pool
 * @param {number} startTime - Unix timestamp in seconds when the incentive starts
 * @param {string} refundee - The address where all refunds should go 
 */
async function createIncentive(staker, token, poolAddress, startTime, refundee) {
    // TODO: approve the staker contract to spend the token

    const incentiveKey = {
        // IERC20Minimal rewardToken;
        // IUniswapV3Pool pool;
        // uint256 startTime;
        // uint256 endTime;
        // address refundee;
    };

    return staker.createIncentive(incentiveKey, incentiveAmount);
}

module.exports = createIncentive;