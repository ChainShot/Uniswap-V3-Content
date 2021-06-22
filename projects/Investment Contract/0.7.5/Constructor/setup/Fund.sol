// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;
pragma abicoder v2;

import "./IERC20.sol";
import "./ISwapRouter.sol";

contract Fund {
  IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

  address public investment;
  bytes public path;

  constructor(bytes memory _path, address _investment) {
      
  }

  function deposit(uint _amount) external {
    
  }

  function withdraw() external {
    
  }
}
