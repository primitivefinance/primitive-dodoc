// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.9;

interface IBar {
    /// @notice Notice of T
    /// @dev Dev of T
    /// @param paramA A number
    /// @param paramB An address
    struct T {
        uint256 paramA;
        address paramB;
    }

    /// @notice Sets a T
    /// @dev Uses a struct
    /// @param t T struct FTW
    function set(T memory t) external;

    function boop(uint256 bar) external;

    /// @notice Emitted when transfer
    /// @dev Transfer some stuff
    /// @param foo Amount of stuff
    event Transfer(uint256 foo);

    /// @notice Thrown when doh
    /// @dev Bad doh error
    /// @param yay A bool
    error Doh(bool yay);
}

/// @title   Bar contract
/// @author  Primitive
/// @notice  Manages the bar
/// @dev     Blablou
contract Bar is IBar {
    /// @inheritdoc IBar
    function set(T memory t) external { }

    /// @notice Cool function bro
    function boop(uint256 bar) external { }

    /// @notice Baaps the yaps
    /// @param bar Number of bar
    /// @param aar Address of aar
    function baap(uint256 bar, address aar) external { }
}
