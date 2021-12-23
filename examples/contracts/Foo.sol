// SPDX-License-Identifier: GPL-3.0-only
pragma solidity 0.8.9;

interface IFoo {
    /// @notice Returns the nonce of an address
    /// @dev Nonces much
    /// @param _0 Address to inspect
    /// @return Current nonce of the address
    function nonces(address _0) external view returns (uint256);
}

contract Foo is IFoo {
    /// @inheritdoc IFoo
    mapping(address => uint256) public override nonces;


    /**
     * Removes all objects after and including a given index.
     * @param a Object index to delete from.
     */
    function doThing(address a)public{

    }

    /**
     * Removes all objects after and including a given index. Also allows setting the global
     * metadata field.
     * @param a Object index to delete from.
     * @param b New global metadata for the container.
     */
    function doThing(address a, uint b) public {

    }
}
