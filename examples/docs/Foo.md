# Foo















## Methods


### doThing


```solidity
function doThing(address a) external nonpayable

```

Removes all objects after and including a given index.






#### Parameters

| Name | Type | Description |
|---|---|---|

| a | address | Object index to delete from.






### doThing


```solidity
function doThing(address a, uint256 b) external nonpayable

```

Removes all objects after and including a given index. Also allows setting the global metadata field.






#### Parameters

| Name | Type | Description |
|---|---|---|

| a | address | Object index to delete from.


| b | uint256 | New global metadata for the container.






### nonces


```solidity
function nonces(address) external view returns (uint256)

```

Returns the nonce of an address


*Nonces much*



#### Parameters

| Name | Type | Description |
|---|---|---|

| _0 | address | Address to inspect





#### Returns

| Name | Type | Description |
|---|---|---|

| _0 | uint256 | Current nonce of the address











