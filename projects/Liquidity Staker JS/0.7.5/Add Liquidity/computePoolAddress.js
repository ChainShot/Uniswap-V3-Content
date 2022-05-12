const { bytecode } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json');
const POOL_BYTECODE_HASH = ethers.utils.keccak256(bytecode);
const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

function computePoolAddress([tokenA, tokenB], fee) {
    const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA]
    const constructorArgumentsEncoded = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'uint24'],
        [token0, token1, fee]
    )
    const create2Inputs = [
        '0xff',
        factoryAddress,
        // salt
        ethers.utils.keccak256(constructorArgumentsEncoded),
        // init code hash
        POOL_BYTECODE_HASH,
    ]
    const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join('')}`
    return ethers.utils.getAddress(`0x${ethers.utils.keccak256(sanitizedInputs).slice(-40)}`)
}


module.exports = computePoolAddress;