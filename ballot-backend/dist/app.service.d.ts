import { ethers } from 'ethers';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private configService;
    contract: ethers.Contract;
    provider: ethers.Provider;
    wallet: ethers.Wallet;
    constructor(configService: ConfigService);
    getHello(): string;
    getSomething(): string;
    getContractAddress(): string;
    getTokenName(): Promise<any>;
    getTotalSupply(): Promise<string>;
    getTokenBalance(address: string): Promise<string>;
    getTransactionReceipt(hash: string): Promise<ethers.TransactionReceipt>;
    getServerWalletAddress(): string;
    checkMinterRole(address: string): Promise<any>;
    mintTokens(address: string, amount: number): Promise<any>;
}
