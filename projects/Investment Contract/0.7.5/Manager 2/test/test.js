const chai = require('chai');
const { assert, expect } = chai;

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
    const path = encodePath([DAI_ADDR, WETH_ADDR, UNI_ADDR], [3000, 3000]);
    let fund;
    before(async () => {
        const Fund = await ethers.getContractFactory("Fund");
        fund = await Fund.deploy();
        await fund.deployed();
    });

    describe("a manager invests", () => {
        it("should not revert", async () => {
            await fund.invest(path);
        });
    });

    describe("a non-manager invests", () => {
        it("should revert", async () => {
            const nonManager = await ethers.provider.getSigner(1);
            await expect(fund.connect(nonManager).invest(path)).to.be.reverted;
        });
    });
});