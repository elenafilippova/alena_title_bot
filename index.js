const { Telegraf } = require('telegraf');
const helpers = require('./helpers');
const express = require('express');
const functions = require('./functions');
const keyboards = require('./keyboards');
const statistics = require('./statistics');
const app = express();

//'-1001888402362' - мой чат для Экспериментов
//'-1001639207446' - чат Детки Осень 2022

app.get('/', function(_request, response) {
  response.send(`Монитор активен. Локальный адрес: http://localhost:${process.env.port}`);
});
app.listen(process.env.port, () => console.log());

const bot = new Telegraf(process.env.token);
bot.launch();

bot.command('start', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, 'Приветствую! Я написан для маленького чата в Телеграмме, по ряду причин у меня отключены функции для работы с любыми другими чатами Телеграмм. При необходимости меня можно немного доработать, и я стану универсальным и управляемым. По данному вопросу можно обратиться к моему создателю: https://t.me/elena_alena . ', {
  }) 
})
//-------------------------------------------------------------------------
bot.command('admin', (ctx) => {

  let isAdmin = helpers.isAdmin(ctx); 
 
  if (isAdmin) { 
    ctx.telegram.sendMessage(ctx.chat.id,
"Выберите действие",
    {
      reply_markup: {
      inline_keyboard: [
        [
          { text: "Загрузить админов", callback_data: "load_admins_action" },
          { text: "Получить статистику", callback_data: "get_statistics_action" },
        ],
      ],
    },
    })
  }
})

//-------------------------------------------------------------------------
// ЗАГРУЗКА АДМИНОВ

bot.action('load_admins_action', async (ctx) => {
    keyboards.loadChatsKeyboard(ctx, "load_admins");
});

bot.action(/^load_admins(-\w+)$/, async (ctx) => {
  let chat_id = ctx.match[1];
  let chatInfo = await bot.telegram.getChat(chat_id);
  let chat_title = chatInfo.title;
  await functions.loadChatAdmins(bot, chat_id, chat_title);
})
//-------------------------------------------------------------------------
// ВЫВОД СТАТИСТИКИ ПО ПОДПИСЯМ ЧАТА

async function log(ctx, chat_id, text) {

  let chatInfo = await bot.telegram.getChat(chat_id);
  let chatName = chatInfo.title;
  
  helpers.log2(bot, chatName, text, ctx.chat.id);
}

bot.action('get_statistics_action', async (ctx) => {

    let statistics_keyboard = keyboards.getStatisticsKeyboard();
    
    ctx.telegram.sendMessage(ctx.chat.id,
"Выберите статистику",
    {
      reply_markup: {
      inline_keyboard: statistics_keyboard 
      },
    }) 
})

  bot.action('statistics', async (ctx) => { 
     keyboards.loadChatsKeyboard(ctx, "statistics");
  })

bot.action(/^statistics(-\w+)$/, async (ctx) => { 
  let chat_id = ctx.match[1];
  let statistics_text = await statistics.getUsersStatistics(chat_id);
  await log(ctx, chat_id, statistics_text);
})

bot.action('real_admins', async (ctx) => { 
     keyboards.loadChatsKeyboard(ctx, "real_admins");
})

bot.action(/^real_admins(-\w+)$/, async (ctx) => {
  let chat_id = ctx.match[1];
  let statistics_text = await statistics.getRealAdmins(chat_id);
   await log(ctx, chat_id, statistics_text);
 })

bot.action('fictive_admins', async (ctx) => { 
     keyboards.loadChatsKeyboard(ctx, "fictive_admins");
})

bot.action(/^fictive_admins(-\w+)$/, async (ctx) => {
  let chat_id = ctx.match[1];
   let statistics_text = await statistics.getFictiveAdmins(chat_id);
   await log(ctx, chat_id, statistics_text);
 })

bot.action('users_without_title', async (ctx) => { 
     keyboards.loadChatsKeyboard(ctx, "users_without_title");
})

bot.action(/^users_without_title(-\w+)$/, async (ctx) => {
  let chat_id = ctx.match[1];
  let statistics_text = await statistics.getUsersWithoutTitle(chat_id);
   await log(ctx, chat_id, statistics_text);
 })
//-------------------------------------------------------------------------

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
    await functions.saveMessagesUserToFile(ctx, bot, messagesUser);
  }  
})