const TelegramBot = require('node-telegram-bot-api');
const { format } = require('path');
const { start } = require('repl');
const fs = require('fs');
const { includes } = require('lodash');

const token = process.env["token"];

const bot = new TelegramBot(token, { polling: true });

bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'Test ok');
});