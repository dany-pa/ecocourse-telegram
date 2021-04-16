# Телеграм бот для :green_book:мини-курса по экологии.
В день можно ответить на один вопрос. Количество попыток не ограничено. Раз в сутки бот присылает напоминание о новых вопросах. Сам бот поднят на ![http://webecoshop.herokuapp.com/](https://img.shields.io/badge/Heroku-9e7cc1).
## Команды:
  - <kbd>/start</kbd> - Начинает общение с ботом. Бот регистрирует пользователя и позволяет начать один из курсов.
  - <kbd>/задание</kbd> - Бот присылает одно доступное задание.
  - <kbd>/ответ</kbd> - Пользователь присылает ответ на текущий вопрос. МОжно выбрать на интерактивной клавиатуре,или написать вручную. Бот проверяет правильность и сообщает об этом.
  
## Используемые технологии:
- __Сервер:__ 
  - ![](https://nodejs.org/static/images/favicons/favicon-16x16.png) Библиотека [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
  
- __База данных__
  - <img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="16px" height="16px"> PostgreSQL
