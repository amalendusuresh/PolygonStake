// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IFlashLoanReceiver {
    /**
     * @notice Called by the FlashLoanProvider after a loan is granted.
     * @param token Address of the token used for the flash loan.
     * @param amount Amount of the tokens borrowed.
     * @param fee Fee for the flash loan.
    */
    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee
    ) external returns (bool);
}
