Этот бот умеет проставлять подписи пользователей в чатах телеграмма. Вопрос подписей тщательно изучался, и лучшим решением на февраль 2023 года стало динамическое назначение фиктивных администраторов чата с индивидуальными подписями. 

Телеграмм разрешает назначать в чате не более 50 администраторов (включая создателя чата). При запуске бота, он определяет настоящих администраторов чата (имеющих права на те или иные действия в чате). С остальным "резервом" администраторов бот работает динамически. Получив сообщение от того или иного пользователя чата, бот из своей базы данных получает подпись для данного пользователя и назначает данного пользователя фиктивным админом с данной подписью. Таким образом, в процессе общения, у всех пользователей, имеющих в базе данных сведения о подписи, появляется личная подпись в чате (в правом верхнем углу каждого его сообщения). 

У бота имеется отдельный чат для логов, где можно видеть всю историю назначения админов чата, видеть ошибки работы бота, видеть, у какого пользователя отсутствует подпись в данном чате.

Также для бота написана админка (команда /admin), которая в данный момент работает только для создателя бота. Админка позволяет видеть, в каких чатах работает бот, сколько в чате реальных, сколько фиктивных пользователей (и кто они), видеть, у кого в чате отсутствуют подписи.

По техническим причинам бот не дописан до конца, также "обрезана" возможность работать с другими чатами. Бот работает на бесплатной платформе без подключения к нормальной базе данных (в данный момент в роли базы данных выступает текстовый файл).

Кодовая база бота является рабочей, и успешно выполняет свои функции в экспериментальном чате. Для доработки бота желателен переезд на платный сервер, перенос данных чатов в базу данных, требуется доработка кнопок для работы с пользователем (пользователь должен сам задавать и удалять свои подписи).

Мои планы по боту, если соберусь его дописывать: 

1. Определить, в каких чатах состоит бот, и в случае перезагрузки бота, автоматически загружать в базу данных данные об админах, автоматически отрисовывать кнопки админки и т.д. и т.п. Бот должен работать для всех чатов, а не только для моих двух тестовых.
2. Объединить функции log и log2, навести порядок в этом вопросе
3. Дописать функцию /start: 
	- Определяем, в каких чатах состоит чел, предлагаем вывести main_info для тех чатов, где он состоит (какие у него подписи в каждом из чатов, где он настоящий админ, где фиктивный, что-то еще..)
	- Предлагаем пользователю кнопки для установки (удаления) подписей в каждом из чатов
4. Дописать функцию админки так, чтобы ей могли пользоваться только реальные админы чата (сейчас ей могу пользоваться только я)
5. Рефакторинг кода
6. Другие доработки (этим надо заниматься дальше, искать, улучшать). 