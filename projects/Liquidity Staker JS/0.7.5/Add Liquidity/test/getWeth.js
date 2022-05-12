const depositorAddr = "0x0f4ee9631f4be0a63756515141281a3e2b293bbe";

async function getWeth(weth, accts) {
    const signer = await ethers.provider.getSigner(accts[0]);
    await signer.sendTransaction({ to: depositorAddr, value: ethers.utils.parseEther("1") });
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [depositorAddr]
    });
    depositorSigner = await ethers.provider.getSigner(depositorAddr);

    for (let i = 0; i < accts.length; i++) {
        await weth.connect(depositorSigner).transfer(accts[i], ethers.utils.parseEther("1000"));
    }
}

module.exports = getWeth;
