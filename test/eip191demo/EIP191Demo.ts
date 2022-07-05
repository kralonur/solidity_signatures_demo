import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { EIP191Demo__factory } from "../../src/types";
import { Signers } from "../types";

describe("EIP191Demo tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Check", function () {
    before(async function () {
      this.eip191Demo = await getEIP191DemoContract(this.signers);
    });

    it("Should return hash from contract", async function () {
      const from = this.signers.admin.address;
      const targetContract = this.eip191Demo.address;
      const chainTo = Number(await network.provider.send("eth_chainId"));
      const nonce = await this.signers.admin.getTransactionCount();

      console.log(await this.eip191Demo.getHash(from, targetContract, chainTo, nonce));
    });

    it("Should return signature owner from contract", async function () {
      const from = this.signers.admin.address;
      const targetContract = this.eip191Demo.address;
      const chainTo = Number(await network.provider.send("eth_chainId"));
      const nonce = await this.signers.admin.getTransactionCount();

      const hash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256"],
        [from, targetContract, chainTo, nonce],
      );
      console.log(`hash: `, hash);

      const hashArray = ethers.utils.arrayify(hash);
      console.log(`hashArray: `, hashArray);

      const signedMessage = await this.signers.admin.signMessage(hashArray);
      console.log(`signedMessage: `, signedMessage);

      const signature = ethers.utils.splitSignature(signedMessage);
      console.log(`signature: `, signature);

      expect(
        await this.eip191Demo.getAddress(from, targetContract, chainTo, nonce, signature.v, signature.r, signature.s),
      ).equal(this.signers.admin.address);
    });
  });
});

async function getEIP191DemoContract(signers: Signers) {
  const factory = new EIP191Demo__factory(signers.admin);
  const contract = await factory.deploy();
  await contract.deployed();

  return contract;
}
