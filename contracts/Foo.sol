// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.9;

/// @title Title goes here
/// @author Author goes here
/// @notice Notice of the contract goes here
/// @dev Dev of the contract goes here
contract Foo {
  /// @notice Emitted when doSomething is called
  /// @dev More info about the event
  /// @param a Address of someone
  /// @param b A random number
  event DoSomething(
    address a,
    uint256 b
  );

  /// @notice Thrown when an error happens
  /// @dev More info about the error
  /// @param expected Bad address
  /// @param actual Good address
  error DoSomethingError(address expected, address actual);

  /// @notice This is the fallback
  /// @dev Please send ETH
  fallback() external {
    // A fallback function
  }

  /// @notice Does something
  /// @dev More info about do something
  ///      and testing double lines
  /// @param a Address to do something
  /// @param b Number to do something
  /// @return foo First Return variable
  /// @return bar second Return variable
  function doSomething(address a, uint256 b) external returns (
    uint256 foo,
    uint256 bar
  ) {
    if (a == address(0)) revert DoSomethingError(a, msg.sender);
    emit DoSomething(a, b);

    bar = 42;
    foo = 0;
  }

  /// @notice Does another thing
  /// @dev More info about doing another thing
  /// @param num A random number
  /// @return A random variable
  function anotherThing(uint256 num) external pure returns (uint256) {
    return 42 + num;
  }

  /// @notice            Poorly documented function
  function boop() external view returns (address) {
    return msg.sender;
  }
}
