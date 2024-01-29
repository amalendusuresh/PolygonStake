// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IFlashLoanReceiver.sol";

contract MockFlashLoanReceiver is IFlashLoanReceiver {
    using SafeERC20 for IERC20;

    // State variable to store the address of the FlashLoanProvider contract
    address public flashLoanProvider;

    // Event to emit when flash loan is received and paid back
    event FlashLoanReceivedAndPaid(address token, uint256 amount, uint256 fee);

    // Constructor to set the FlashLoanProvider address
    constructor(address _flashLoanProvider) {
        flashLoanProvider = _flashLoanProvider;
    }

    // Function that must be implemented to receive flash loans
    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee 
    ) external override returns (bool) {
        // Assumption: msg.sender is the FlashLoanProvider contract
        require(msg.sender == flashLoanProvider, "Only flashLoanProvider can call this function");

        // Emit an event showing we've received and are about to repay the flash loan
        emit FlashLoanReceivedAndPaid(token, amount, fee);


        // Repay the flash loan + fee
        IERC20(token).safeTransfer(msg.sender, amount + fee);

        return true;
    }

    // Include fallback and receive functions so the contract can receive ETH if needed
    receive() external payable {}
    fallback() external payable {}
}