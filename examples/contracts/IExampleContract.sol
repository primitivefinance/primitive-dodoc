// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.6;

/// @title Interface of our ExampleContract
/// @author 0xAn0n
/// @notice Put a simple description of the contract here.
/// @dev And then a more complicated and tech oriented description of the contract there.
interface IExampleContract {
  /// @notice Emitted when the function doSomething is called.
  /// @dev More info about the event can be added here.
  /// @param a Address of someone
  /// @param b A random number
  event DoSomething(
    address indexed a,
    uint256 b
  );

  /// @notice Thrown when an error happens.
  /// @dev More info about the error.
  /// @param expected Expected address
  /// @param actual Actual address
  error RandomError(address expected, address actual);

  /// @notice Does something when this function is called.
  /// @dev More info about the doSomething, and this even works
  /// when the explanation is on two lines.
  /// @param a Address to do something
  /// @param b Number to do something
  /// @return foo First return variable
  /// @return bar Second return variable
  function doSomething(address a, uint256 b) external returns (
    uint256 foo,
    uint256 bar
  );

  /// @notice A bad documented payable function.
  function pay() external payable;

  /// @notice Does another thing when the function is called.
  /// @dev More info about doing another thing when the function is called.
  /// @param num A random number
  /// @return A random variable
  function anotherThing(uint256 num) external pure returns (uint256);

  /// @notice            Poorly documented function starting with weird spaces.
  function boop() external view returns (address);
}
