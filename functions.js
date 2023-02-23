const fs = require('fs');
const helpers = require('./helpers');
let admins = []; // все админы чата
const maxAdminsCount = 3;

let config = {
  "log_chat_id": '-858690299'  // мой чат для логов
};

// Загружаем из чата актуальную информацию обо всех админах чата
let loadChatAdmins = async (ctx) => {

  admins = [];
  // получаем список всех админов чата
  let chatAdmins = await ctx.getChatAdministrators(ctx.chat.id);
  // формируем пользователей с данными для сохранения в файл
  chatAdmins.forEach(admin => {
    let user = admin.user;
    // является ли админ фиктивным? (Нужен только для подписей в чате)
    let isFictiveAdmin =
      user.is_bot === false &&
      admin.can_change_info === false &&
      admin.can_delete_messages === false &&
      //admin.can_invite_users === false &&
      admin.can_restrict_members === false &&
      admin.can_pin_messages === false &&
      admin.can_manage_topics === false &&
      admin.can_promote_members === false &&
      admin.can_manage_video_chats === false &&
      admin.is_anonymous === false &&
      admin.can_manage_voice_chats === false;

    admins.push({
      id: user.id,
      is_admin: true,
      is_fictive: isFictiveAdmin,
      is_bot: user.is_bot,
      first_name: user.first_name,
      last_name: user.last_name ?? "",
      username: user.username,
      custom_title: admin.custom_title
    });
  });

  helpers.log(ctx, config.log_chat_id, "Получен список админов чата. Всего админов: " + admins.length);
}

// Определяем, является ли пользователь админом чата (любым)
let isAdmin = (userId) => {
  let result = admins.find(user => user.id === userId) !== undefined;
  return result;
}

// Сохраняем данные об админах в users.json
let saveChatAdminsToFile = async (ctx) => {

  let file_users = await getUsersFromFile(ctx.chat.id);
  saveAdminsToUsers(admins, file_users);
  await saveUsersToFile(ctx.chat.id, file_users);
}

// Сохраняем пользователя, создавшего сообщение в users.json
let saveMessagesUserToFile = async (ctx, user) => {

  let file_users = await getUsersFromFile(ctx.chat.id);
  console.log(file_users);

  if (admins.length === 0) {
    await loadChatAdmins(ctx);
    saveAdminsToUsers(admins, file_users);
  }

  let file_user = await saveMessagesUserToUsers(file_users, user);

  if (!file_user.is_admin) {
    let message = file_user.first_name + " - это обычный пользователь. ";
    if (file_user.custom_title.length === 0) {
      message += "⚠️ Внимание! У пользователя не задана подпись!"
    } else {
      message += "Ему будет присвоен custom_title: " + file_user.custom_title;
    }
    helpers.log(ctx, config.log_chat_id, message);
    await tryToMakeFictiveAdmin(ctx, file_users, file_user);
  }

  await saveUsersToFile(ctx.chat.id, file_users);
}

// Получаем всех пользователей из файла users.json
async function getUsersFromFile(chat_id) {

  let obj = {
    users: []
  };

  let fileName = getFileName(chat_id);

  try {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName);
      obj = JSON.parse(data);
    }
    return obj.users;
  }

  catch (err) {
    console.error(err);
    return null;
  }
}

function getFileName(chat_id) {
  return 'users_' + chat_id.toString() + '.json';
}

// Сохраняем всех пользователей в файл users.json
async function saveUsersToFile(chat_id, users) {

  let obj = {
    users: []
  };

  if (users !== undefined && users.length > 0) {

    obj.users = users;

    let json = JSON.stringify(obj);
    fs.writeFile(getFileName(chat_id), json, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }
}

// Сохраняем данные об админах в массив users
function saveAdminsToUsers(admins_users, file_users) {

  let file_user;

  admins_users.forEach(admin_user => {

    if (file_users.length > 0) {
      file_user = file_users.find(file_user => file_user.id === admin_user.id);
    }
    // если в файлике еще не сохранен данный пользователь
    if (file_user === undefined) {
      admin_user.messages_count = 0;
      file_users.push(admin_user);
    } else {
      // обновляем данные существующего пользователя
      file_user.first_name = admin_user.first_name;
      file_user.last_name = admin_user.last_name ?? "";
      file_user.username = admin_user.username;
      file_user.is_admin = admin_user.is_admin;
      file_user.is_fictive = admin_user.is_fictive;
      file_user.custom_title = admin_user.custom_title;
    }
  });
}

// Сохраняем данные о пользователе, написавшем сообщение, в массив users 
async function saveMessagesUserToUsers(file_users, messagesUser) {

  let file_user;

  if (file_users.length > 0) {
    file_user = file_users.find(file_user => file_user.id === messagesUser.id);
  }
  // если в файлике еще не сохранен данный пользователь
  if (file_user === undefined) {
    file_user = messagesUser;
    file_user.messages_count = 1;
    file_user.custom_title = "";
    file_user.is_fictive = false;
    file_users.push(file_user);
  } else {
    // обновляем данные существующего пользователя
    file_user.first_name = messagesUser.first_name;
    file_user.last_name = messagesUser.last_name ?? "";
    file_user.username = messagesUser.username;
    //file_user.is_fictive = messagesUser.is_fictive;
    file_user.messages_count++;
  }

  let is_admin = isAdmin(messagesUser.id);
  file_user.is_admin = is_admin;

  return file_user;
}

// Создаем нового фиктивного админа в чате, если необходимо
async function tryToMakeFictiveAdmin(ctx, file_users, file_user) {
  if (file_user.custom_title.length > 0) {

    let updateResult = true;
    // если количество админов равно максимальному
    if (maxAdminsCount === admins.length) {

      // то удаляем наименее активного админа чата и назначаем нашего нового
      // отбираем фиктивных админов, отсортированных по возрастанию количества сообщений в чате
      let fictive_admins = file_users.filter(user => user.is_admin === true && user.is_fictive === true).sort(helpers.compare('messages_count'));
      // отбираем самого "слабака" (первый в списке фиктивных)
      let weak_admin = fictive_admins !== undefined && fictive_admins.length > 0 ? fictive_admins[0] : null;
      helpers.log(ctx, config.log_chat_id, "Пробуем удалить фиктивного админа: " + weak_admin?.first_name);
      // console.log("weak_admin: ");
      // console.log(weak_admin);
      if (weak_admin !== null) {

        let updateResult = await updateRightsForUser(ctx, weak_admin.id, false, null);
        // если присвоение привелегий обломилось, снова подгружаем данные по админам из чата (такое возможно, если кто-то "ручками" и без нашего бота правил админов в чате)
        if (!updateResult) {
          await loadChatAdmins(ctx);
          await saveChatAdminsToFile(ctx);
          updateResult = await updateRightsForUser(ctx, weak_admin.id, false, null);
        }

        if (updateResult) {
          weak_admin.is_admin = false;
          weak_admin.is_fictive = true;
          admins = admins.filter((item) => item.id !== weak_admin.id);
        }
      }
    }
    if (updateResult) {
      // нашего пользака делаем фиктивным админом
      updateResult = await updateRightsForUser(ctx, file_user.id, true, file_user.custom_title);

      if (updateResult) {
        file_user.is_admin = true;
        file_user.is_fictive = true; admins.push(file_user);
      }
      console.log("ALL ADMINS: ");
      console.log(admins);
    }
  }
}

// Делаем пользователя фиктивным админом (либо убираем из фиктивных админов)
let updateRightsForUser = async (ctx, userId, isAdmin, custom_title) => {

  let updateResult = true;

  try {

    let chatId = ctx.chat.id;

    if (isAdmin) {
      // делаем пользователя фиктивным админом 
      await ctx.telegram.promoteChatMember(chatId, userId, {
        сan_manage_chat: true,
        can_invite_users: true
      });

      if (custom_title.length > 0) {
        let title_result = await ctx.telegram.setChatAdministratorCustomTitle(chatId, userId, custom_title);
        console.log("title_result: " + title_result);
        console.log("promote is ok");
      }
    } else {
      // удаляем пользователя из админов
      await ctx.telegram.promoteChatMember(chatId, userId, {
        can_manage_chat: false,
        can_invite_users: false
      })

      console.log("demote is ok");
    }
  } catch (err) {
    console.log(err);
    updateResult = false;
  }

  return updateResult;
}

module.exports = { loadChatAdmins, saveChatAdminsToFile, saveMessagesUserToFile, updateRightsForUser }