const { assert } = require("chai");
const getDai = require("./getDai");

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const UNI_ADDR = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

const FEE_SIZE = 3;
function encodePath(path, fees) {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
    }

    let encoded = '0x';
    for (let i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2);
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);

    return encoded.toLowerCase();
}

describe("Fund Single Depositor", function () {
    let fund, dai, uni;
    before(async () => {
        const Fund = await ethers.getContractFactory("Fund");
        fund = await Fund.deploy();
        await fund.deployed();

        dai = await ethers.getContractAt("IERC20", DAI_ADDR);
        weth = await ethers.getContractAt("IERC20", WETH_ADDR);
        uni = await ethers.getContractAt("IERC20", UNI_ADDR);
    });

    describe("after a deposit", () => {
        const deposit = ethers.utils.parseEther("100");
        let signer1, addr1, currentDepositBalance;
        before(async () => {
            signer1 = await ethers.provider.getSigner(0);
            addr1 = await signer1.getAddress();
            await getDai(dai, [addr1]);
            await dai.approve(fund.address, deposit);

            await fund.deposit(deposit);
            currentDepositBalance = await dai.balanceOf(fund.address);
        });

        it("should have increased the dai holdings", async () => {
            assert(currentDepositBalance.eq(deposit));
        });

        it("should have set their share", async () => {
            let share = await fund.share(addr1);
            assert(share.eq(deposit));
        });

        describe("after a second deposit from another addr", () => {
            const deposit2 = ethers.utils.parseEther("100");
            let signer2, addr2;
            before(async () => {
                signer2 = await ethers.provider.getSigner(1);
                addr2 = await signer2.getAddress();
                await getDai(dai, [addr2]);
                await dai.connect(signer2).approve(fund.address, deposit2);

                await fund.connect(signer2).deposit(deposit2);
                currentDepositBalance = await dai.balanceOf(fund.address);
            });

            it("should have increased the dai holdings", async () => {
                assert(currentDepositBalance.eq(deposit.add(deposit2)));
            });

            it("should have set their share", async () => {
                let share = await fund.share(addr1);
                assert(share.eq(deposit2));
            });


            describe("after an investment", () => {
                before(async () => {
                    const path = encodePath([DAI_ADDR, WETH_ADDR, UNI_ADDR], [3000, 3000]);

                    await fund.invest(path);
                });

                it("should hold uni", async () => {
                    const uniBalance = await uni.balanceOf(fund.address);
                    assert(uniBalance.gt(0));
                });

                it("should no longer hold dai", async () => {
                    const daiBalance = await dai.balanceOf(fund.address);
                    assert(daiBalance.eq(0));
                });

                describe("after a divestment", () => {
                    before(async () => {
                        const path = encodePath([UNI_ADDR, WETH_ADDR, DAI_ADDR], [3000, 3000]);

                        await fund.divest(path);
                    });

                    it("should no longer hold uni", async () => {
                        const uniBalance = await uni.balanceOf(fund.address);
                        assert(uniBalance.eq(0));
                    });

                    it("should hold dai", async () => {
                        const daiBalance = await dai.balanceOf(fund.address);
                        assert(daiBalance.gt(0));
                    });

                    describe("withdrawals", () => {
                        before(async () => {
                            await fund.connect(signer1).withdraw();
                            await fund.connect(signer2).withdraw();
                        });

                        it("should no longer hold dai", async () => {
                            const daiBalance = await dai.balanceOf(fund.address);
                            assert(daiBalance.lte(1));
                        });

                        it("should withdraw to both depositors", async () => {
                            const balance1 = await dai.balanceOf(addr1);
                            const balance2 = await dai.balanceOf(addr2);
                            assert(balance1.gt(0));
                            assert(balance2.gt(0));
                        });
                    });
                });
            });
        });
    });
});