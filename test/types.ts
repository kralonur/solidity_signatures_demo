import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { EIP191Demo, EIP712Demo, EIP712DemoDraft } from "../src/types";

declare module "mocha" {
  export interface Context {
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    eip191Demo: EIP191Demo;
    eip712Demo: EIP712Demo;
    eip712DemoDraft: EIP712DemoDraft;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
