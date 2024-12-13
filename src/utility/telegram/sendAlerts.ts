import { Telegraf } from "telegraf";

const sendMigrationAlert = async (
  bot: any,
  id: string,
  new_token_addr: string
) => {
  console.log(bot, id, new_token_addr);
  const message = `
New token graduated :
token : ${new_token_addr}  
  `;
  bot.telegram.sendMessage(id, message, {});
};

export { sendMigrationAlert };
