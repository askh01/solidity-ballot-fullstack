import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getSomethingElse(): string;
    getContractAddress(): {
        result: string;
    };
    getTokenName(): Promise<{
        result: any;
    }>;
    getTotalSupply(): Promise<{
        result: string;
    }>;
    getTokenBalance(address: string): Promise<{
        result: string;
    }>;
    getTransactionReceipt(hash: string): Promise<{
        result: import("ethers").TransactionReceipt;
    }>;
    getServerWalletAddress(): {
        result: string;
    };
    checkMinterRole(address: string): Promise<{
        result: any;
    }>;
    mintTokens(body: MintTokenDto): Promise<{
        result: any;
    }>;
}
