// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.9;

interface IFoo {
    /// @notice Returns the nonce of an address
    /// @dev Nonces much
    /// @param _0 Address to inspect
    /// @return Current nonce of the address
    function nonces2(address _0) external view returns (uint256);
}

contract Foo is IFoo {
    /// @inheritdoc IFoo
    mapping(address => uint256) public override nonces2;
}
