// Логируем события в отдельный (мой) чат
function log(ctx, text) {
  let chatName = ctx.chat.title;
  ctx.telegram.sendMessage(process.env.log_chat_id, "#" + chatName + '\n' + text, { parse_mode: 'HTML' });
}

 // Проверяем, является ли отправитель сообщения админом чата
function isAdmin(ctx) {
   return ctx.from.id == process.env.admin_id;
}

// Возвращаем описание пользователя (для логов)
function getUserDescription(user) {
   return `<b> ${user?.first_name ?? "пользователь не определен"} ${user?.last_name} (${user?.id}) </b>`;
}

// Вспомогательная функция для сортировки массива по одному свойству
function compare(field, order) {
  var len = arguments.length;
  if (len === 0) {
    return (a, b) => (a < b && -1) || (a > b && 1) || 0;
  }
  if (len === 1) {
    switch (typeof field) {
      case 'number':
        return field < 0 ?
          ((a, b) => (a < b && 1) || (a > b && -1) || 0) :
          ((a, b) => (a < b && -1) || (a > b && 1) || 0);
      case 'string':
        return (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0;
    }
  }
  if (len === 2 && typeof order === 'number') {
    return order < 0 ?
      ((a, b) => (a[field] < b[field] && 1) || (a[field] > b[field] && -1) || 0) :
      ((a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0);
  }
  var fields, orders;
  if (typeof field === 'object') {
    fields = Object.getOwnPropertyNames(field);
    orders = fields.map(key => field[key]);
    len = fields.length;
  } else {
    fields = new Array(len);
    orders = new Array(len);
    for (let i = len; i--;) {
      fields[i] = arguments[i];
      orders[i] = 1;
    }
  }
  return (a, b) => {
    for (let i = 0; i < len; i++) {
      if (a[fields[i]] < b[fields[i]]) return orders[i];
      if (a[fields[i]] > b[fields[i]]) return -orders[i];
    }
    return 0;
  };
}

module.exports = { isAdmin, compare, log, getUserDescription }
