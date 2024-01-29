// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MyToken ERC20 Token
/// @author Amalendu Suresh
/// @dev This contract extends the OpenZeppelin ERC20 and Ownable standards
/// to create a custom ERC20 token with ownership capabilities.

contract MyToken is ERC20, Ownable {

    /// @notice Contract constructor that sets up the initial token details
    /// and mints the initial supply to the deployer.
    /// @dev Calls ERC20's constructor with token name and symbol.
    /// Uses `_mint` to create tokens, which updates both the total supply and the balance of the deployer.
    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        // Mint 1 billion tokens to the deployer
        _mint(msg.sender, 1000000000 * 10**decimals());
    }

    /// @notice Mint new tokens and assign them to the `to` address.
    /// @dev Only callable by the owner of the contract.
    /// @param to The address that will receive the minted tokens.
    /// @param amount The number of tokens to mint.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /// @notice Burn tokens from the caller's balance.
    /// @dev Burns `amount` tokens from the caller’s balance, reducing the total supply.   
    /// @param amount The number of tokens to be burnt.
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}