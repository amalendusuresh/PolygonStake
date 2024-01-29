// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";
import "./IFlashLoanReceiver.sol";
import "hardhat/console.sol";

contract FlashLoanProvider is Ownable {
    using SafeERC20 for MyToken;

    MyToken public token;
    uint256 public constant INTEREST_RATE = 5; // 0.05% interest rate

    event FlashLoanExecuted(
        address indexed borrower,
        uint256 amount,
        uint256 fee
    );

    constructor(MyToken _token) Ownable(msg.sender){
        require(address(_token) != address(0), "Token address cannot be zero");
        token = _token;
    }

   function flashLoan(
    uint256 amount,
    IFlashLoanReceiver receiver
    
) external {
    uint256 fee = calculateInterest(amount);
    uint256 totalRepayment = amount + fee;

    uint256 availableLiquidity = token.balanceOf(address(this));
    require(availableLiquidity >= amount, "Insufficient liquidity available");
    
    token.safeTransfer(address(receiver), amount);

    require(
        receiver.executeOperation(address(token), amount, fee),
        "Flash loan operation failed"
    );

    // Here we use totalRepayment to check if the borrower has sent back the correct amount
    require(
        token.balanceOf(address(this)) >= availableLiquidity + totalRepayment,
        "Flash loan hasn't been paid back properly"
    );

    emit FlashLoanExecuted(address(receiver), amount, fee);
}

    function calculateInterest(uint256 amount) internal pure returns (uint256) {
        return (amount * INTEREST_RATE) / 10000;
    }
}