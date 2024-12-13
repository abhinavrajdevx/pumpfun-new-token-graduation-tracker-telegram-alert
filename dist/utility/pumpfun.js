"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestMigratedTokens = void 0;
const web3_js_1 = __importDefault(require("@solana/web3.js"));
const _getLatestMigratedTokens = (address, numTx, solanaConnection) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("request sent");
    try {
        const pubKey = new web3_js_1.default.PublicKey(address);
        let transactionList = yield solanaConnection.getSignaturesForAddress(pubKey, {
            limit: numTx,
        });
        const migrated_tokens_pumpfun_new = [];
        for (let i = 0; i < transactionList.length; i++) {
            const transaction = transactionList[i];
            const tx = yield solanaConnection.getTransaction(transaction.signature, {
                maxSupportedTransactionVersion: 0,
            });
            let log = "";
            let status = false;
            tx.meta.logMessages.map((_log) => {
                log = log + _log;
            });
            status = log.search("initialize2") != -1 ? true : false;
            if (status) {
                let staticAccountKeys_arr = tx.transaction.message.staticAccountKeys[18];
                let x = String(staticAccountKeys_arr).split(" ");
                status = false;
                const token_address = x[0];
                status = token_address.endsWith("pump");
                if (status) {
                    migrated_tokens_pumpfun_new.push(token_address);
                }
            }
        }
        return migrated_tokens_pumpfun_new;
    }
    catch (e) {
        console.log(e);
    }
});
const getLatestMigratedTokens = (solana_router, solanaConnection) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens_migrated_pumpfun = yield _getLatestMigratedTokens(solana_router, 20, solanaConnection);
    return tokens_migrated_pumpfun;
});
exports.getLatestMigratedTokens = getLatestMigratedTokens;
