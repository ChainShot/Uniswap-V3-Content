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
    let fund, path;
    before(async () => {
        path = encodePath([DAI_ADDR, WETH_ADDR, UNI_ADDR], [3000, 3000]);
        const Fund = await ethers.getContractFactory("Fund");
        fund = await Fund.deploy(path, UNI_ADDR);
        await fund.deployed();
    });

    it("should have set the path", async () => {
        const actual = await fund.path();
        assert.equal(actual, path);
    });

    it("should have set the owner", async () => {
        const actual = await fund.owner();
        const [addr1] = await ethers.provider.listAccounts();
        assert.equal(actual, addr1); 
    });
    
    it("should have set the investment", async () => {
        const actual = await fund.investment();
        assert.equal(actual.toLowerCase(), UNI_ADDR.toLowerCase());
    });
});
