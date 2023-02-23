const { Telegraf } = require('telegraf');
const helpers = require('./helpers');
const express = require('express');
const functions = require('./functions')
const app = express();

//'-1001888402362' - мой чат для Экспериментов

let config = {
  "token": process.env.token,
  "port": 3000,
  "admin": 435529327,
  "log_chat_id": '-858690299'  // мой чат для логов
};

app.get('/', function(_request, response) {
  response.send(`Монитор активен. Локальный адрес: http://localhost:${config.port}`);
});
app.listen(config.port, () => console.log());

const bot = new Telegraf(config.token);
bot.launch();

bot.command('load_admins', async (ctx) => {
  await functions.loadChatAdmins(ctx);
  await functions.saveChatAdminsToFile(ctx);
})

bot.command('test', async (ctx) => {
  helpers.log(ctx, config.log_chat_id, "Лог лог");
})

bot.on('message', async (ctx) => {

  const user = ctx.from;

  let messagesUser =
  {
    id: user.id,
    is_bot: user.is_bot,
    first_name: user.first_name,
    last_name: user.last_name ?? "",
    username: user.username ?? ""
  }
  await functions.saveMessagesUserToFile(ctx, messagesUser);
})

// bot.command('admin_off', async (ctx) => {  
//   await functions.updateRightsForUser(ctx, ctx.from.id, false, ""); 
//   const user = ctx.from; 
//  let users = [];
//  users.push({
//       id: user.id,
//       is_bot: user.is_bot,
//       first_name: user.first_name,
//       last_name: user.last_name ?? "",
//       username: user.username,
//       is_admin: false
//     });
// })
