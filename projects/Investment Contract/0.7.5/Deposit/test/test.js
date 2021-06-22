const { assert } = require("chai");
const getDai = require("./getDai");

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const UNI_ADDR = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

const FEE_SIZE = 3;
function encodePath(path, fees) {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match')
    }

    let encoded = '0x'
    for (let i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2)
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0')
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2)

    return encoded.toLowerCase()
}

describe("Fund", function () {
    let fund, dai, uni;
    before(async () => {
        const path = encodePath([DAI_ADDR, WETH_ADDR, UNI_ADDR], [3000, 3000]);
        const Fund = await ethers.getContractFactory("Fund");
        fund = await Fund.deploy(path, UNI_ADDR);
        await fund.deployed();

        dai = await ethers.getContractAt("IERC20", DAI_ADDR);
        weth = await ethers.getContractAt("IERC20", WETH_ADDR);
        uni = await ethers.getContractAt("IERC20", UNI_ADDR);
    });

    describe("after a deposit", () => {
        const deposit = ethers.utils.parseEther("100");
        let signer1, addr1, initialDepositBalance;
        before(async () => {
            signer1 = await ethers.provider.getSigner(0);
            addr1 = await signer1.getAddress();
            await getDai(dai, [addr1]);
            await dai.approve(fund.address, deposit);

            await fund.deposit(deposit);
            initialDepositBalance = await uni.balanceOf(fund.address);
        });

        it("should be invested", async () => {
            assert(initialDepositBalance.gt(0));
        });

        describe("after several deposits", () => {
            before(async () => {
                for (let i = 1; i < 5; i++) {
                    const signer = await ethers.provider.getSigner(i);
                    await getDai(dai, [await signer.getAddress()]);
                    await dai.connect(signer).approve(fund.address, deposit);

                    await fund.connect(signer).deposit(deposit);
                }
            });

            it("should have increased", async () => {
                const currentBalance = await uni.balanceOf(fund.address);
                assert(currentBalance.gt(initialDepositBalance.mul(4)));
            });
        });
    });
});
