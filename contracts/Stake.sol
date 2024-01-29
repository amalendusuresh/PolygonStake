// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title Polygon Staking Contract
/// @author Amalendu Suresh
/// @notice This contract allows users to stake and withdraw their ERC20 tokens.
/// @dev The contract inherits from ReentrancyGuard, Ownable, and Pausable contracts from OpenZeppelin.

contract PolygonStaking is ReentrancyGuard, Ownable, Pausable {

    /// @notice Staking token used in this contract
    IERC20 public stakingToken;

    /// @notice Mapping for tracking staking balances of users
    mapping(address => uint256) private stakingBalances;

    /// @notice The delay for emergency withdrawals in seconds
    uint256 public emergencyWithdrawDelay;

    /// @notice Timestamp marking when an emergency withdrawal becomes possible
    uint256 private emergencyWithdrawTimestamp;

    /// @notice Event emitted when a user stakes tokens
    event Staked(address indexed user, uint256 amount);

    /// @notice Event emitted when a user withdraws staked tokens
    event Withdrawn(address indexed user, uint256 amount);

    /// @notice Event emitted when an emergency withdraw is scheduled
    event EmergencyWithdrawScheduled(uint256 availableTime);

    /// @notice Event emitted when the emergency withdraw timestamp is updated
    event EmergencyWithdrawTimestampUpdated(uint256 newTimestamp);

    /// @notice Contract constructor to set the staking token and the emergency withdraw delay
    /// @param _stakingToken The ERC20 token to be staked
    /// @param _emergencyWithdrawDelay The delay in seconds for the emergency withdraw feature
    constructor(IERC20 _stakingToken, uint256 _emergencyWithdrawDelay) Ownable(msg.sender) {
        stakingToken = _stakingToken;
        emergencyWithdrawDelay = _emergencyWithdrawDelay;
    }

    /// @notice Pauses the staking and withdrawing functions
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the staking and withdrawing functions
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Stake a given amount of tokens
    /// @dev Function is prevented from reentrancy attacks
    /// @param amount The amount of tokens to stake
    function stake(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Cannot stake 0");
        stakingBalances[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /// @notice Withdraw stake from the contract
    /// @dev Function is prevented from reentrancy attacks
    /// @param amount The amount of tokens to withdraw
    function withdraw(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        require(stakingBalances[msg.sender] >= amount, "Insufficient balance to withdraw");
        stakingBalances[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Retrieves the staking balance of specified user
    /// @param user The address of the user to query the balance
    /// @return The staking balance of the user
    function balanceOf(address user) public view returns (uint256) {
        return stakingBalances[user];
    }

    /// @notice Retrieves the token balance of this contract
    /// @return The balance of staking tokens held by the contract
    function getContractBalance() public view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }

    /// @notice Schedules an emergency withdraw
    /// @dev Can only be called by the owner and when not already scheduled or the past scheduled timestamp has passed
    function scheduleEmergencyWithdraw() public onlyOwner {
        require(emergencyWithdrawTimestamp == 0 || block.timestamp >= emergencyWithdrawTimestamp, "Emergency withdraw already scheduled");
        emergencyWithdrawTimestamp = block.timestamp + emergencyWithdrawDelay;
        emit EmergencyWithdrawScheduled(emergencyWithdrawTimestamp);
    }

    /// @notice Executes an emergency withdraw
    /// @dev Can only be called by the owner and after the emergency withdraw delay has passed
    /// @param recipient The address to which the emergency withdrawal of tokens will be made
    /// @param amount The amount of tokens to withdraw in the emergency
    function emergencyWithdraw(address recipient, uint256 amount) public onlyOwner {
        require(block.timestamp >= emergencyWithdrawTimestamp, "Emergency withdraw is not allowed yet");
        require(emergencyWithdrawTimestamp != 0, "Emergency withdraw not scheduled");
        require(stakingBalances[recipient] >= amount, "Insufficient balance to withdraw");
        emergencyWithdrawTimestamp = 0; // Reset the emergency withdraw timestamp
        stakingBalances[recipient] -= amount;
        stakingToken.transfer(recipient, amount);
        emit Withdrawn(recipient, amount);
    }

    /// @notice Sets a new delay for the emergency withdrawal feature
    /// @dev Can only be called by the owner
    /// @param newDelay The new delay in seconds for the emergency withdrawal
    function setEmergencyWithdrawDelay(uint256 newDelay) public onlyOwner {
        require(newDelay > 0, "EmergencyWithdrawDelay must be greater than zero");
        emergencyWithdrawDelay = newDelay;
        emit EmergencyWithdrawTimestampUpdated(newDelay);
    }
}