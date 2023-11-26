import { Get, Injectable } from '@nestjs/common';
import * as tokenJson from './assets/MyToken.json';
import { ethers } from 'ethers';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { throwError } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class AppService {
  contract: ethers.Contract;
  provider: ethers.Provider;
  wallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('INFURA_API_KEY'),
    );
    this.wallet = new ethers.Wallet(
      this.configService.get<string>('PRIVATE_KEY'),
      this.provider,
    );
    this.contract = new ethers.Contract(
      this.configService.get<string>('TOKEN_ADDRESS'),
      tokenJson.abi,
      this.wallet,
    );
  }
  getHello(): string {
    return 'Hello World';
  }
  getSomething(): string {
    return 'something else';
  }
  getContractAddress(): string {
    return this.configService.get<string>('TOKEN_ADDRESS');
  }
  async getTokenName() {
    const name = await this.contract.name();
    return name;
  }
  async getTotalSupply() {
    const totalSupply = await this.contract.totalSupply();
    return ethers.formatUnits(totalSupply);
  }
  async getTokenBalance(address: string) {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatUnits(balance);
  }
  async getTransactionReceipt(hash: string) {
    const txREceipt = await this.provider.getTransactionReceipt(hash);
    return txREceipt;
  }
  getServerWalletAddress() {
    return this.wallet.address;
  }
  async checkMinterRole(address: string) {
    const MINTER_ROLE = await this.contract.MINTER_ROLE();
    const hasRole = await this.contract.hasRole(MINTER_ROLE, address);
    return hasRole;
  }
  async mintTokens(address: string, amount: number) {
    if (this.checkMinterRole('0x49F719613Da44fb4EDF69c3f8544C1a4fe75ceE4')) {
      const tx = await this.contract.mint(address, amount);
      return tx;
    } else {
      throw new Error('Caller does not have Minter Role');
    }
  }
}
