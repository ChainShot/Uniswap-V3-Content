// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "./IERC20.sol";
import "./ISwapRouter.sol";

contract Fund {
    IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    mapping (address => uint) share;

    address investment;
    bytes path;

    constructor(bytes memory _path, address _investment) {
        path = _path;
        investment = _investment;

        IERC20(dai).approve(address(router), uint(-1));
    }

    function deposit(uint _amount) external {
        require(dai.transferFrom(msg.sender, address(this), _amount));

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path,
            address(this),
            block.timestamp,
            _amount,
            0
        );

        share[msg.sender] = router.exactInput(params);
    }

    function withdraw() external {
        require(share[msg.sender] > 0);

        IERC20(investment).transfer(msg.sender, share[msg.sender]);

        share[msg.sender] = 0;
    }
}
