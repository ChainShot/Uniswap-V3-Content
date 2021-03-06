// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/BytesLib.sol";

contract Fund {
    IERC20Minimal dai = IERC20Minimal(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address manager = msg.sender;

    mapping (address => uint) public share;

    uint initialDaiAmount;
    uint endingDaiAmount;

    function deposit(uint _amount) external {
        require(dai.transferFrom(msg.sender, address(this), _amount));

        share[msg.sender] += _amount;
    }

    function invest(bytes memory path) external {
        require(manager == msg.sender);

        initialDaiAmount = dai.balanceOf(address(this));

        dai.approve(address(router), initialDaiAmount);

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path,
            address(this),
            block.timestamp,
            initialDaiAmount,
            0
        );

        router.exactInput(params);
    }
    
    function divest(bytes memory path) external {
        require(manager == msg.sender);

        address asset = BytesLib.toAddress(path, 0);

        uint erc20Amount = IERC20Minimal(asset).balanceOf(address(this));

        IERC20Minimal(asset).approve(address(router), erc20Amount);

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path,
            address(this),
            block.timestamp,
            erc20Amount,
            0
        );

        router.exactInput(params);

        endingDaiAmount = dai.balanceOf(address(this));
    }

    // function withdraw() external {
        
    // }
}
