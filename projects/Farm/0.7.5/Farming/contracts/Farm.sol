// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./INonfungiblePositionManager.sol";
import "./IERC20.sol";

contract Contract {    
	INonfungiblePositionManager constant nonfungiblePositionManager = INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    IERC20 constant farmToken = IERC20(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    uint constant emissionsRate = 150;
	int24 tickUpper;
	int24 tickLower;

    struct Deposit {
        uint timestamp;
        address owner;
    }

    mapping(uint => Deposit) deposits;

	constructor(int24 _tickLower, int24 _tickUpper) {
		tickLower = _tickLower;
		tickUpper = _tickUpper;
	}

    function onERC721Received(address, address from, uint256 tokenId, bytes calldata) external returns (bytes4) {
        require(msg.sender == address(nonfungiblePositionManager));

        (, , , , , int24 tl, int24 tu, , , , , ) = nonfungiblePositionManager.positions(tokenId);

        require(tl == tickLower);
        require(tu == tickUpper);

        deposits[tokenId] = Deposit(block.timestamp, from);
		
        return this.onERC721Received.selector;
    }

    function unstake(uint tokenId) external {
        Deposit memory deposit = deposits[tokenId];

        require(deposit.owner == msg.sender);

        (, , , , , , , uint128 liquidity, , , , ) = nonfungiblePositionManager.positions(tokenId);

        uint difference = block.timestamp - deposit.timestamp;

        uint reward = liquidity * emissionsRate * difference;

        farmToken.mint(msg.sender, reward);

        delete deposits[tokenId];
    }
}
