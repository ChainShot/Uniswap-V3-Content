// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/BytesLib.sol";

contract Fund {
    IERC20Minimal dai = IERC20Minimal(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address owner = msg.sender;

    bool public hasInvested; 
    bool public hasDivested;

    mapping (address => uint) public share;

    uint public initialDaiAmount;
    uint public endingDaiAmount;

    function deposit(uint _amount) external {
        require(dai.transferFrom(msg.sender, address(this), _amount));

        share[msg.sender] += _amount;
    }

    // function invest(bytes memory path) external {
        
    // }
    
    // function divest(bytes memory path) external {
        
    // }

    // function withdraw() external {
        
    // }
}
