const functions = require('./functions');
const helpers = require('./helpers');

// Получаем всю основную статистику по пользакам
async function getUsersStatistics(chatId) {

  let file_users = await functions.getUsersFromFile(chatId);

  let statistics_text = "#Статистика Данные по пользователям из файла users: \n";

  statistics_text += " \n • Всего пользователей сохранено в файле: <b>" + file_users.length + "</b>";

   let admins = file_users.filter(file_user => file_user.is_admin === true);
  //console.log(admins);
   let real_admins = admins.filter(admin => admin.is_fictive === false);
   let fictive_admins_count = admins.length - real_admins.length; 
    statistics_text += ` \n • Всего администраторов: <b>${admins.length}.</b> Из них реальных админов - <b>${real_admins.length}</b>, фиктивных - <b>${fictive_admins_count}</b>`;

  let users_without_title = file_users.filter(file_user => file_user.custom_title === "") ?? [];
  statistics_text += ` \n • Не заданы подписи у <b>${users_without_title.length}</b> пользователей`;

   return statistics_text;
}

// Получаем 
async function getRealAdmins(chatId) {

  let file_users = await functions.getUsersFromFile(chatId);

  let statistics_text = "#Статистика Данные по пользователям из файла users: \n";

   let real_admins = file_users.filter(file_user => file_user.is_admin === true && file_user.is_fictive === false);
  let names = real_admins.map(a => helpers.getUserDescription(a)).join(", \n");
  //console.log(admins);
    statistics_text += ` \n • Настоящие администраторы чата: \n ${names} \n(всего ${real_admins.length})`;

   return statistics_text;
}

// Получаем 
async function getFictiveAdmins(chatId) {

  let file_users = await functions.getUsersFromFile(chatId);

  let statistics_text = "#Статистика Данные по пользователям из файла users: \n";

   let fictive_admins = file_users.filter(file_user => file_user.is_admin === true && file_user.is_fictive === true);
  let names = fictive_admins.map(a => helpers.getUserDescription(a)).join(", \n");
  //console.log(admins);
    statistics_text += ` \n • Фиктивные администраторы чата: \n${names} \n(всего ${fictive_admins.length})`;

   return statistics_text;
}

// Получаем 
async function getUsersWithoutTitle(chatId) {

  let file_users = await functions.getUsersFromFile(chatId);

  let statistics_text = "#Статистика Данные по пользователям из файла users: \n";

   let users_without_title = file_users.filter(file_user => file_user.custom_title === "");
  let names = users_without_title.map(a => helpers.getUserDescription(a)).join(", \n");
  //console.log(admins);
    statistics_text += ` \n • Пользователи чата без подписи: \n${names} \n(всего ${users_without_title.length})`;

  return statistics_text;
}

module.exports = { getUsersStatistics, getRealAdmins, getFictiveAdmins, getUsersWithoutTitle }