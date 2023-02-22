const { Telegraf } = require('telegraf');
const express = require('express');
const functions = require('./functions')
const app = express();
const port = 3000;
//const chatId = '-1001888402362';

app.get('/', function(_request, response) { 
  response.send(`Монитор активен. Локальный адрес: http://localhost:${port}`); });
  app.listen(port, () => console.log());

const bot = new Telegraf(process.env.token);
bot.launch();

bot.command('load_admins', async (ctx) => {
    await functions.loadChatAdmins(ctx);
    await functions.saveChatAdminsToFile();
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