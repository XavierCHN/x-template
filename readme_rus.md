# X-Template

Шаблон разработки игры Chavier's Dota2

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg) [![Version](https://img.shields.io/github/release/XavierCHN/x-template.svg)]()

### Предыдущие условия

Если вы хотите использовать этот шаблон, в дополнение к освоению инструмента разработки V, вам также нужно учиться дополнительным

1. `typescript`, `javascript` Синтаксис
2. `react` Базовые знания
3. `node.js`Базовые знания
4. Учиться[react-panorama](https://github.com/ark120202/react-panorama)
5. Учиться[TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua)
6. Узнать о `DOTA2 Typescript API`，Заканчивать`npm install`Вы можете просмотреть`node_modules/dota-lua-types`с участием`node_modules/panorama-types`

-   Конечно, использование сильных типов языка требует, у вас есть лучший спецификация кода и объявление записи. :wink:
-   Однако также можно улучшить свою эффективность кода.

### Поддерживаемые функции

1. 将`excels`Содержание папки становится kv Файл и положить его`game/scripts/npc`папка
2. 将`localization`Содержание папки генерирует соответствующий язык языка и положить его`game/resources`папка
3. 将`game/scripts/npc`文件夹的内容同步到`content/panorama/scripts/keyvalues.js`
4. Фронтальный`content/panorama/src`С бэкэндом`game/scripts/src`Папка используется для записи источника реагирования пользовательского интерфейса и исходный код Game Logic TS.

### Поддерживаемые инструкции

1. «Запуск NPM RUN [[ADDON_NAME] MAP_NAME]` Запустите dota2, два параметра являются необязательными параметрами, если «Addon_Name предоставляется, то загрузите указанный дополнительный адрес (элемент по умолчанию), предоставить« MAP_NAME ». Автоматически загрузить соответствующее имя карты ( Если Addon_Name не предоставляется, текущий аддон загружен по умолчанию)
2. NPM RUN DEV` Введите режим Dev, выполнит синхронный KV к JS, генерирую локализацию, Excel до KV и т. Д.
3. `NPM RUD PROD` Выполните операцию публикации` Dota_developer`] Выпуск устанавливается).

### Шаги для использования

1. [Нажмите на этот элемент в качестве шаблона, чтобы создать свой собственный проект](https://github.com/XavierCHN/x-template/generate)или [fork Этот проект](https://github.com/XavierCHN/x-template/fork)
2. Установите `Node.js`, запрос выше узла V14.10.1 ~~ Поскольку на этой версии нет теста ~~
3. Сгенерированный клон или проект Fork
4. Откройте `package.json`, поверните` имя`, чтобы изменить имя, которое вам нравится
5. Выполните «NPM INSTALL», он должен автоматически ссылаться на автоматическую ссылку.
6. `NPM запустить dev`, начните свое развитие
7. 
### Содержание папки

- Содержимое будет и `dota 2 beta / content / dota_addons / your_addon_name`
- игра и `dota 2 beta / game / dota_addons / your_addon_name` синхронное обновление
- Shared используется для записи `Panorama TS и` и` TSTL`, как` custom_net_tables и т. Д.
- Excels, используемые для написания таблиц KV
- Локализация используется для написания различных локализованных текстов
- Скрипты Все виды сценариев узла для выполнения различных вспомогательных функций

### Другая работа

1. Если вам нужно шифровать, пожалуйста, измените его сами.`scripts/publish.js`
2. Добро пожаловать`issues`
3. Добро пожаловать в свой свой вклад

### Спасибо

-   ModDota Community
-   [https://github.com/ark120202](https://github.com/ark120202) 开发的`react-panorama`和对 API 的维护
-   有部分代码来自 [https://github.com/MODDOTA/TypeScriptAddonTemplate](https://github.com/MODDOTA/TypeScriptAddonTemplate)
