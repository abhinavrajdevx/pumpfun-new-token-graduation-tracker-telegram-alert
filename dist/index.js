"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const web3_js_1 = __importDefault(require("@solana/web3.js"));
const pumpFun_1 = require("./utility/pumpFun");
const telegraf_1 = require("telegraf");
const sendAlerts_1 = require("./utility/telegram/sendAlerts");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const endpoint = process.env.SOLANA_RPC_ENDPOINT;
const BOT_TOKEN = process.env.BOT_TOKEN;
const solanaConnection = new web3_js_1.default.Connection(endpoint);
const solana_router = "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg";
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
const migrated_tokens_pumpfun_old = [];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const _x = yield (0, pumpFun_1.getLatestMigratedTokens)(solana_router, solanaConnection);
        //@ts-ignore
        _x.forEach((_token) => {
            migrated_tokens_pumpfun_old.push(_token);
        });
        console.log("Intital array old : ", migrated_tokens_pumpfun_old);
        while (true) {
            setTimeout(() => { }, 5000);
            const _x = yield (0, pumpFun_1.getLatestMigratedTokens)(solana_router, solanaConnection);
            if (!_x) {
                console.log("x is undefined");
                return;
            }
            _x.forEach((_token_new) => {
                let exists = false;
                migrated_tokens_pumpfun_old.forEach((_token_old) => {
                    if (_token_old == _token_new)
                        exists = true;
                });
                if (!exists) {
                    console.log("new token : ");
                    console.log(_token_new);
                    (0, sendAlerts_1.sendMigrationAlert)(bot, "-1002261022338", _token_new);
                    migrated_tokens_pumpfun_old.push(_token_new);
                }
            });
        }
    });
}
main();
