const { assert } = require("chai");

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const UNI_ADDR = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

describe('Contract', function () {
    let dai, uni, addr1, contract, deposit;
    before(async () => {
        [addr1] = await ethers.provider.listAccounts();
        deposit = ethers.utils.parseEther("10000");
        await modifyDaiBalance(addr1, deposit);

        dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
        uni = await ethers.getContractAt("IERC20Minimal", UNI_ADDR);

        const Contract = await ethers.getContractFactory("Contract");
        contract = await Contract.deploy();
        await contract.deployed();

        await dai.approve(contract.address, deposit);
        await contract.addDai(deposit);
    });

    it("should hold the ether initially", async () => {
        const balance = await dai.balanceOf(contract.address);
        assert(balance.eq(deposit));
    });

    describe("trading DAI", () => {
        before(async () => {
            const path = encodePath([DAI_ADDR, WETH_ADDR, UNI_ADDR], [3000, 3000]);

            await contract.tradeDai(path);
        });

        it("should hold no dai", async () => {
            const balance = await dai.balanceOf(contract.address);
            assert(balance.eq(0));
        });

        it("should hold uni", async () => {
            const balance = await uni.balanceOf(contract.address);
            assert(balance.gt(0));
        });
    });
});

async function modifyDaiBalance(addr, balance) {
    const storageSlot = ethers.utils.hexZeroPad(2, "32");
    const paddedAddr = ethers.utils.hexZeroPad(addr, "32");
    const slot = ethers.utils.keccak256(paddedAddr + storageSlot.slice(2));

    await network.provider.send("hardhat_setStorageAt", [
        DAI_ADDR,
        slot,
        ethers.utils.hexZeroPad(balance, "32")
    ]);
}


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