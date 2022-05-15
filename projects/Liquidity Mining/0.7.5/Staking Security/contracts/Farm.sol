// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "./INonfungiblePositionManager.sol";
import "./IERC20.sol";

contract TurtleFarm {    
    address constant uniswapFactory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address constant uniswapPool = 0x3a0DdD0F3ff19Db49cAC556976264783bdA98969;
	INonfungiblePositionManager constant nonfungiblePositionManager = INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    IERC20 constant turtleToken = IERC20(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    uint constant rewardRate = 150;
    
	int24 public tickUpper;
	int24 public tickLower;

    struct Deposit {
        uint timestamp;
        address owner;
        uint128 liquidity;
    }

    mapping(uint => Deposit) public deposits;

	constructor(int24 _tickLower, int24 _tickUpper) {
		tickLower = _tickLower;
		tickUpper = _tickUpper;
	}

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata) external returns (bytes4) {
        require(msg.sender == address(nonfungiblePositionManager));
        
        (, , address token0, address token1, uint24 fee, int24 tl, int24 tu, uint128 liquidity, , , , ) = nonfungiblePositionManager.positions(tokenId);

        require(tl == tickLower);
        require(tu == tickUpper);

        address pool = PoolAddress.computeAddress(
            uniswapFactory,
            PoolAddress.PoolKey({token0: token0, token1: token1, fee: fee})
        );
        require(pool == uniswapPool);

        deposits[tokenId] = Deposit(block.timestamp, from, liquidity);
		
        return this.onERC721Received.selector;
    }
}
