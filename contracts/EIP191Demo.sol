// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EIP191Demo {
    using ECDSA for bytes32;

    function getAddress(
        address from,
        address targetContract,
        uint256 chainTo,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (address signatureOwner) {
        (, bytes32 ethSignedMessageHash) = getHash(from, targetContract, chainTo, nonce);
        signatureOwner = ethSignedMessageHash.recover(v, r, s);
    }

    function getHash(
        address from,
        address targetContract,
        uint256 chainTo,
        uint256 nonce
    ) public pure returns (bytes32 hash, bytes32 ethSignedMessageHash) {
        hash = keccak256(abi.encodePacked(from, targetContract, chainTo, nonce));
        ethSignedMessageHash = hash.toEthSignedMessageHash();
    }
}
