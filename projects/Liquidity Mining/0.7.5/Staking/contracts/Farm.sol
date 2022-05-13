// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./INonfungiblePositionManager.sol";
import "./IERC20.sol";

contract TurtleFarm {    
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
        (, , , , , int24 tl, int24 tu, uint128 liquidity, , , , ) = nonfungiblePositionManager.positions(tokenId);
        
        deposits[tokenId] = Deposit(block.timestamp, from, liquidity);
		
        return this.onERC721Received.selector;
    }
}
