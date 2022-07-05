// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract EIP712Demo {
    using ECDSA for bytes32;

    bytes32 public constant DOMAIN_TYPE_HASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    bytes32 public constant STRUCT_TYPE_HASH =
        keccak256("Struct(address from,address targetContract,uint256 chainTo,uint256 nonce)");

    function getAddress(
        string memory name,
        string memory version,
        address from,
        address targetContract,
        uint256 chainTo,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (address signatureOwner) {
        bytes32 hash = getTypedDataHash(name, version, from, targetContract, chainTo, nonce);
        signatureOwner = hash.recover(v, r, s);
    }

    function getTypedDataHash(
        string memory name,
        string memory version,
        address from,
        address targetContract,
        uint256 chainTo,
        uint256 nonce
    ) public view returns (bytes32 typedDataHash) {
        bytes32 domainSeparator = getDomainSeparator(name, version);
        bytes32 structHash = getStructHash(from, targetContract, chainTo, nonce);

        typedDataHash = ECDSA.toTypedDataHash(domainSeparator, structHash);
    }

    function getDomainSeparator(string memory name, string memory version)
        public
        view
        returns (bytes32 domainSeparator)
    {
        bytes32 nameHash = keccak256(bytes(name));
        bytes32 versionHash = keccak256(bytes(version));

        domainSeparator = keccak256(abi.encode(DOMAIN_TYPE_HASH, nameHash, versionHash, block.chainid, address(this)));
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
