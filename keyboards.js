function loadChatsKeyboard(ctx, actionName) {
  let inline_keyboard = [
        [
          { text: "Эксперимент от Алёны", callback_data: `${actionName}-1001888402362`},
          { text: "Детки - ОСЕНЬ 2022", callback_data: `${actionName}-1001639207446`}
          ]
        ]  

   ctx.telegram.sendMessage(ctx.chat.id, "Выберите чат",
    {
      reply_markup: {
      inline_keyboard: inline_keyboard 
      },
    }) 
}

function getStatisticsKeyboard() {
  let inline_keyboard = [
          [
            { text: "Общая статистика", callback_data: "statistics"},
            { text: "Настоящие админы", callback_data: "real_admins"},
          ],
          [
            { text: "Фиктивные админы", callback_data: "fictive_admins"},
            { text: "У кого нет подписи", callback_data: "users_without_title"}
          ]
        ]  

  return inline_keyboard;
}

module.exports = { loadChatsKeyboard, getStatisticsKeyboard }