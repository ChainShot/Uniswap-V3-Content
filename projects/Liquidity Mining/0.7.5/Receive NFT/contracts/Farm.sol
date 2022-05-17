// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./INonfungiblePositionManager.sol";
import "./IERC20.sol";

contract TurtleFarm {    
	INonfungiblePositionManager constant nonfungiblePositionManager = INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    IERC20 constant turtleToken = IERC20(0x821f3361D454cc98b7555221A06Be563a7E2E0A6);
    uint constant rewardRate = 150;
    
	int24 public tickUpper;
	int24 public tickLower;

	constructor(int24 _tickLower, int24 _tickUpper) {
		tickLower = _tickLower;
		tickUpper = _tickUpper;
	}

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata) external returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
