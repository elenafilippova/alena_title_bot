const { Telegraf } = require('telegraf');
const helpers = require('./helpers');
const express = require('express');
const functions = require('./functions')
const app = express();

//'-1001888402362' - мой чат для Экспериментов

app.get('/', function(_request, response) {
  response.send(`Монитор активен. Локальный адрес: http://localhost:${process.env.port}`);
});
app.listen(process.env.port, () => console.log());

const bot = new Telegraf(process.env.token);
bot.launch();

bot.command('load_admins', async (ctx) => {

  let isAdmin = helpers.isAdmin(ctx); 

  if (isAdmin) { 
    await functions.loadChatAdmins(ctx);
    await functions.saveChatAdminsToFile(ctx);
  }
 })

bot.on('message', async (ctx) => {
  //console.log(ctx.chat.id);

  const user = ctx.from;

  if (!user.is_bot) {
     let messagesUser =
    {
      id: user.id,
      is_bot: user.is_bot,
      first_name: user.first_name,
      last_name: user.last_name ?? "",
      username: user.username ?? ""
    }
    await functions.saveMessagesUserToFile(ctx, messagesUser);
  }  
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
