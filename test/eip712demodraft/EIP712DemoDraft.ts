import { TypedDataDomain } from "@ethersproject/abstract-signer";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { EIP712DemoDraft__factory } from "../../src/types";
import { Signers } from "../types";

describe("EIP712DemoDraft tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Check", function () {
    before(async function () {
      this.eip712DemoDraft = await getEIP712DemoDraftContract(this.signers);
    });

    it("Should return struct hash from contract", async function () {
      const from = this.signers.admin.address;
      const targetContract = this.eip712DemoDraft.address;
      const chainId = Number(await network.provider.send("eth_chainId"));
      const nonce = await this.signers.admin.getTransactionCount();

      console.log(await this.eip712DemoDraft.getStructHash(from, targetContract, chainId, nonce));
    });

    it("Should return typed data hash from contract", async function () {
      const from = this.signers.admin.address;
      const targetContract = this.eip712DemoDraft.address;
      const chainId = Number(await network.provider.send("eth_chainId"));
      const nonce = await this.signers.admin.getTransactionCount();

      console.log(await this.eip712DemoDraft.getTypedDataHash(from, targetContract, chainId, nonce));
    });

    it("Should return signature owner from contract", async function () {
      const name = "Struct";
      const version = "1";
      const chainId = Number(await network.provider.send("eth_chainId"));
      const verifyingContract = this.eip712DemoDraft.address;

      const from = this.signers.admin.address;
      const targetContract = this.eip712DemoDraft.address;
      const chainTo = Number(await network.provider.send("eth_chainId"));
      const nonce = await this.signers.admin.getTransactionCount();

      const domain: TypedDataDomain = {
        name: name,
        version: version,
        chainId: chainId,
        verifyingContract: verifyingContract,
      };

      const types = {
        Struct: [
          { name: "from", type: "address" },
          { name: "targetContract", type: "address" },
          { name: "chainTo", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      };

      const value = {
        from: from,
        targetContract: targetContract,
        chainTo: chainTo,
        nonce: nonce,
      };

      const signedMessage = await this.signers.admin._signTypedData(domain, types, value);
      console.log(`signedMessage: `, signedMessage);

      const signature = ethers.utils.splitSignature(signedMessage);
      console.log(`signature: `, signature);

      console.log(ethers.utils.verifyTypedData(domain, types, value, signedMessage));

      expect(
        await this.eip712DemoDraft.getAddress(
          from,
          targetContract,
          chainTo,
          nonce,
          signature.v,
          signature.r,
          signature.s,
        ),
      ).equal(this.signers.admin.address);
    });

    it("Should return signature owner from contract(v2)", async function () {
      const name = "Struct";
      const version = "1";
      const chainId = Number(await network.provider.send("eth_chainId"));
      const verifyingContract = this.eip712DemoDraft.address;

      const from = this.signers.admin.address;
      const targetContract = this.eip712DemoDraft.address;
      const chainTo = Number(await network.provider.send("eth_chainId"));
      const nonce = await this.signers.admin.getTransactionCount();

      const typedData = {
        domain: {
          name: name,
          version: version,
          chainId: chainId,
          verifyingContract: verifyingContract,
        },
        types: {
          Struct: [
            { name: "from", type: "address" },
            { name: "targetContract", type: "address" },
            { name: "chainTo", type: "uint256" },
            { name: "nonce", type: "uint256" },
          ],
        },
        value: {
          from: from,
          targetContract: targetContract,
          chainTo: chainTo,
          nonce: nonce,
        },
      };

      const signedMessage = await this.signers.admin._signTypedData(typedData.domain, typedData.types, typedData.value);
      console.log(`signedMessage: `, signedMessage);

      const signature = ethers.utils.splitSignature(signedMessage);
      console.log(`signature: `, signature);

      console.log(ethers.utils.verifyTypedData(typedData.domain, typedData.types, typedData.value, signedMessage));

      expect(
        await this.eip712DemoDraft.getAddress(
          from,
          targetContract,
          chainTo,
          nonce,
          signature.v,
          signature.r,
          signature.s,
        ),
      ).equal(this.signers.admin.address);
    });
  });
});

async function getEIP712DemoDraftContract(signers: Signers) {
  const factory = new EIP712DemoDraft__factory(signers.admin);
  const contract = await factory.deploy();
  await contract.deployed();

  return contract;
}
