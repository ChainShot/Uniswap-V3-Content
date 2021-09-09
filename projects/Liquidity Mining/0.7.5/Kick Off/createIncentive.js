async function createIncentive(staker, token, poolAddress, startTime, refundee) {
    const endTime = startTime + (60 * 60 * 24 * 30);
    await token.approve(staker.address, ethers.utils.parseEther("9000"));
    const incentiveKey = {
        rewardToken: token.address,
        pool: poolAddress,
        startTime,
        endTime,
        refundee
    };
    return staker.createIncentive(incentiveKey, ethers.utils.parseEther("9000"));
}

module.exports = createIncentive;