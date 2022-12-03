const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', function(request, response){ response.send(`Монитор активен. Локальный адрес: http://localhost:${port}`); });
app.listen(port, () => console.log());

const token = process.env["token"];
const bot = new TelegramBot(token, { polling: true });

bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'Test ok');
});