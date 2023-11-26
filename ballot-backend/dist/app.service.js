"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const tokenJson = require("./assets/MyToken.json");
const ethers_1 = require("ethers");
require("dotenv/config");
const config_1 = require("@nestjs/config");
require('dotenv').config();
let AppService = class AppService {
    constructor(configService) {
        this.configService = configService;
        this.provider = new ethers_1.ethers.JsonRpcProvider(this.configService.get('INFURA_API_KEY'));
        this.wallet = new ethers_1.ethers.Wallet(this.configService.get('PRIVATE_KEY'), this.provider);
        this.contract = new ethers_1.ethers.Contract(this.configService.get('TOKEN_ADDRESS'), tokenJson.abi, this.wallet);
    }
    getHello() {
        return 'Hello World';
    }
    getSomething() {
        return 'something else';
    }
    getContractAddress() {
        return this.configService.get('TOKEN_ADDRESS');
    }
    async getTokenName() {
        const name = await this.contract.name();
        return name;
    }
    async getTotalSupply() {
        const totalSupply = await this.contract.totalSupply();
        return ethers_1.ethers.formatUnits(totalSupply);
    }
    async getTokenBalance(address) {
        const balance = await this.contract.balanceOf(address);
        return ethers_1.ethers.formatUnits(balance);
    }
    async getTransactionReceipt(hash) {
        const txREceipt = await this.provider.getTransactionReceipt(hash);
        return txREceipt;
    }
    getServerWalletAddress() {
        return this.wallet.address;
    }
    async checkMinterRole(address) {
        const MINTER_ROLE = await this.contract.MINTER_ROLE();
        const hasRole = await this.contract.hasRole(MINTER_ROLE, address);
        return hasRole;
    }
    async mintTokens(address, amount) {
        if (this.checkMinterRole('0x49F719613Da44fb4EDF69c3f8544C1a4fe75ceE4')) {
            const tx = await this.contract.mint(address, amount);
            return tx;
        }
        else {
            throw new Error('Caller does not have Minter Role');
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map