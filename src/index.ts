import solanaWeb3 from "@solana/web3.js";
import { getLatestMigratedTokens } from "./utility/pumpFun";
import { Telegraf } from "telegraf";
import { sendMigrationAlert } from "./utility/telegram/sendAlerts";

const endpoint = process.env.SOLANA_RPC_ENDPOINT as string;
const BOT_TOKEN = process.env.BOT_TOKEN as string;

const solanaConnection = new solanaWeb3.Connection(endpoint);
const solana_router = "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg";

const bot = new Telegraf(BOT_TOKEN);

const migrated_tokens_pumpfun_old: string[] = [];

async function main() {
  const _x = await getLatestMigratedTokens(solana_router, solanaConnection);
  //@ts-ignore
  _x.forEach((_token) => {
    migrated_tokens_pumpfun_old.push(_token);
  });
  console.log("Intital array old : ", migrated_tokens_pumpfun_old);

  while (true) {
    setTimeout(() => {}, 5000);
    const _x = await getLatestMigratedTokens(solana_router, solanaConnection);
    if (!_x) {
      console.log("x is undefined");
      return;
    }
    _x.forEach((_token_new) => {
      let exists = false;
      migrated_tokens_pumpfun_old.forEach((_token_old) => {
        if (_token_old == _token_new) exists = true;
      });
      if (!exists) {
        console.log("new token : ");
        console.log(_token_new);
        sendMigrationAlert(bot, "-1002261022338", _token_new);
        migrated_tokens_pumpfun_old.push(_token_new);
      }
    });
  }
}

main();
