# X-Шаблон

![Лицензия: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) [![Версия](https://img.shields.io/github/release/XavierCHN/x-template.svg)]() Шаблон разработки пользовательских игр для Dota 2 от Завьера (переведено на английский с помощью [chatgpt](https://chat.openai.com/))

### Предварительные требования

Если вы хотите использовать этот шаблон, помимо владения инструментами разработки Valve, вам также необходимо изучить

1. синтаксис `typescript`, `javascript`
2. основы `react`
3. основы `node.js`
4. изучить [react-panorama](https://github.com/ark120202/react-panorama)
5. изучить [TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua)
6. ознакомиться с `DOTA2 Typescript API`, вы можете посмотреть `node_modules/dota-lua-types` и `node_modules/panorama-types`, когда закончите выполнение `yarn`.

### Поддерживаемые функции

1. преобразование файлов xlsx, xls kv в файл kv и помещение его в `game/scripts/npc`,
2. преобразование `addon.csv` в `addon_*.txt`, (вы также можете обратно преобразовать их в `addon.csv`),
3. преобразование файлов kv в файлы json, чтобы вы могли получать данные kv в интерфейсе Panorama,
4. использование TypeScript для написания игровой логики и интерфейса Panorama в `content/panorama/src` и `game/scripts/src`.

- пожалуйста, проверьте `gulpfile.ts` для получения дополнительной информации.

### Поддерживаемые команды

1. `yarn launch [[addon_name] map_name]` запускает Dota 2, все параметры необязательны, если указано `addon_name`, то будет загружен указанный аддон (по умолчанию загружается этот проект), если указано `map_name`, то автоматически будет загружено соответствующее имя карты (если `addon_name` не указан, то по умолчанию будет загружен текущий аддон)
2. `yarn dev` вход в режим разработки для компиляции и отслеживания изменений файлов ts.
3. `yarn prod` для выполнения операции `publish`, автоматически создает папку `publish` и автоматически создает ссылку на папку `dota_addons/you_addon_name_publish`, затем вы можете выбрать эту папку для публикации (вы можете установить некоторые настройки для публикации в `package.json -> dota_developer`, чтобы задать некоторые настройки для публикации).
4. `yarn compile` для компиляции исходного содержимого

### Использование

1. [нажмите "Use this project as a template" для создания своего проекта](https://github.com/XavierCHN/x-template/generate) или [форкните этот проект](https://github.com/XavierCHN/x-template/fork)
2. установите `node.js`, требуется версия Node не ниже 14.10.1 ~~ так как более старшие версии не тестировались ~~
3. клонируйте созданный проект или форк
4. откройте `package.json` и измените `name` на предпочитаемое имя
5. выполните `yarn` для установки зависимостей, это должно автоматически создать ссылку на папки `content` и `game` в вашем каталоге `dota 2 beta/dota_addons/your_preferred_name` (если возникнут проблемы с разрешениями, попробуйте перезапустить)
6. выполните `yarn dev` и начните разработку

### Содержание

-   `content` синхронизирован с `dota 2 beta/content/dota_addons/your_addon_name`
-   `game` синхронизирован с `dota 2 beta/game/dota_addons/your_addon_name`
-   `shared` для написания общих объявлений, используемых в `panorama` и `typescript-to-lua`, например, `custom net tables`
-   `excels` для редактирования таблиц kv
-   `localization` для написания локализационных файлов
-   `scripts` содержит некоторые вспомогательные скрипты

1. если вам нужна шифрование, посмотрите `scripts/publish.js`
2. не стесняйтесь создавать `issues`
3. вклад в развитие приветствуется

### Благодарности

-   Сообщество ModDota
-   React-panorama разработан [https://github.com/ark120202](https://github.com/ark120202)
-   Некоторый код взят из [https://github.com/MODDOTA/TypeScriptAddonTemplate](https://github.com/MODDOTA/TypeScriptAddonTemplate)
