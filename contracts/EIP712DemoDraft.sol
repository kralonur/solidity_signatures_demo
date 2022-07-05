// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract EIP712DemoDraft is EIP712 {
    using ECDSA for bytes32;

    bytes32 public constant STRUCT_TYPE_HASH =
        keccak256("Struct(address from,address targetContract,uint256 chainTo,uint256 nonce)");

    constructor() EIP712("Struct", "1") {}

    function getAddress(
        address from,
        address targetContract,
        uint256 chainTo,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (address signatureOwner) {
        bytes32 hash = getTypedDataHash(from, targetContract, chainTo, nonce);
        signatureOwner = hash.recover(v, r, s);
    }

    function getTypedDataHash(
        address from,
        address targetContract,
        uint256 chainTo,
        uint256 nonce
    ) public view returns (bytes32 typedDataHash) {
        bytes32 structHash = getStructHash(from, targetContract, chainTo, nonce);

        typedDataHash = _hashTypedDataV4(structHash);
    }

    function getStructHash(
        address from,
        address targetContract,
        uint256 chainTo,
        uint256 nonce
    ) public pure returns (bytes32 structHash) {
        structHash = keccak256(abi.encode(STRUCT_TYPE_HASH, from, targetContract, chainTo, nonce));
    }
}
