// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "./IERC20.sol";
import "./ISwapRouter.sol";
import "./BytesLib.sol";

contract Fund {
    IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address owner = msg.sender;

    mapping (address => uint) share;

    uint initialDaiAmount;
    uint endingDaiAmount;

    function deposit(uint _amount) external {
        require(dai.transferFrom(msg.sender, address(this), _amount));

        share[msg.sender] += router.exactInput(params);
    }

    function invest(bytes memory path) external {
        require(owner == msg.sender);

        initialDaiAmount = dai.balanceOf(address(this);

        IERC20(dai).approve(address(router), initialDaiAmount));

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path,
            address(this),
            block.timestamp,
            initialDaiAmount,
            0
        );
    }
    
    function divest(bytes memory path) external {
        require(owner == msg.sender);

        address asset = BytesLib.toAddress(path, 0);

        uint erc20Amount = IERC20(asset).balanceOf(address(this));

        IERC20(asset).approve(address(asset), erc20Amount);

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path,
            address(this),
            block.timestamp,
            erc20Amount,
            0
        );

        endingDaiAmount = dai.balanceOf(address(this);
    }

    function withdraw() external {
        require(share[msg.sender] > 0);

        uint owed = (share[msg.sender] * endingDaiAmount) / initialDaiAmount;

        IERC20(investment).transfer(msg.sender, owed);

        share[msg.sender] = 0;
    }
}
