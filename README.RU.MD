# X-Template

![Лицензия: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
### [简体中文](https://github.com/XavierCHN/x-template?tab=readme-ov-file#x-template) | [English Readme](https://github.com/XavierCHN/x-template/blob/master/README.EN.MD) | [Русское описание](https://github.com/XavierCHN/x-template/blob/master/README.RU.MD)

Пользовательский шаблон разработки игр Dota 2 от Xavier

Русская версия переведена с использованием [DeepSeek](https://www.deepseek.com/)

## Шаги использования
[Краткий видеоурок (на китайском)](https://www.bilibili.com/video/BV1de4y1s7kw/?vd_source=9bc3eaf21f82a00973f08ff2dbcfd356)

### Создание нового проекта
1. [Использовать этот репозиторий как шаблон](https://github.com/XavierCHN/x-template/generate) или [сделать форк](https://github.com/XavierCHN/x-template/fork)
2. Установить [Node.js](https://nodejs.org)
3. Выполнить `git clone` вашего проекта
4. Установить [VSCode](https://code.visualstudio.com/download) и открыть папку проекта
5. Открыть `scripts/addon.config.ts`, изменить `addon_name` на название вашего проекта
6. Выполнить `yarn install` для установки зависимостей
7. Выполнить `yarn dev` для запуска разработки
8. **Используйте `yarn launch map_name` для быстрого тестирования или `yarn launch` для запуска только инструментов**

### Преимущества
1. Разработка на современных языках ([TypeScript](https://www.typescriptlang.org/)) для клиента и сервера
2. Управление KV-файлами через таблицы
3. Использование `React` для разработки UI без написания XML
4. Решены проблемы инструментов Valve: "UI не читает KV-файлы" и "автосборка изображений"
5. Поддержка шифрования кода для релиза
6. Анализ производительности через флейм-графы - см. [руководство](https://github.com/XavierCHN/x-template/blob/master/game/scripts/src/utils/performance/flame_graph_profiler.md)

### Особенности
1. Клиентский код в `content/panorama/src`, серверный - в `game/scripts/src` на TypeScript
2. Конвертация Excel → KV в `game/scripts/npc` с автоматической генерацией JSON для TS
3. Двусторонняя конвертация `addon.csv` ↔ `addon_*.txt`
4. Генерация TS-интерфейсов из API через [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)

### Команды
1. **Рекомендуется: `yarn launch [[addon_name] map_name]`**
2. `yarn dev` - Режим разработки с отслеживанием изменений
3. `yarn prod` - Сборка для релиза (с опциональным шифрованием)
4. `yarn api` - Генерация клиентов API из `scripts/server_api.json` (Swagger 3.0) в `game/scripts/src/server/services`

### Структура каталогов
- `content` синхронизируется с `dota 2 beta/content/dota_addons/your_addon_name`
- `game` синхронизируется с `dota 2 beta/game/dota_addons/your_addon_name`
- `shared` содержит общие TS-декларации
- `scripts` содержит Node.js-скрипты
- Подробности сборки в `gulpfile.ts`

### Рекомендуемые инструменты
- Окружение: [Node.js](https://nodejs.org/), [LuaForWindows](http://luaforwindows.luaforge.net/), [Python](https://www.python.org/)
- Запуск Dota 2 через [Steam](https://store.steampowered.com/about/)

##### Основное ПО:
1. Редактор: [VSCode](https://code.visualstudio.com)
2. Декомпиляторы: [ValveResourceFormat](https://github.com/SteamDatabase/ValveResourceFormat/releases) / [GCFScape](https://nemstools.github.io/pages/GCFScape-Download.html)
3. Adobe: [Photoshop](https://www.adobe.com/), [Audition](https://www.adobe.com/)
4. Контроль версий: [GitHub Desktop](https://desktop.github.com/), [SourceTree](https://www.sourcetreeapp.com/), [TortoiseSVN](https://tortoisesvn.net/)
5. 3D-моделирование: [Blender через Steam](steam://install/365670) ([Страница](https://store.steampowered.com/app/365670/Blender/))
6. Утилиты: [Everything](https://www.voidtools.com/), [DeepL](https://www.deepl.com/translator), [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

### Частые вопросы
- Ошибки прав при `yarn install`?
Закройте редакторы и повторите в консоли или перезагрузите систему.
- Проблемы с сетью?
Выполните `yarn config set registry https://registry.npmmirror.com` и повторите.
- Как запускать несколько команд вместе с `yarn dev`?
Используйте **Ctrl+Shift+5** в VSCode для открытия нескольких терминалов.
- Где найти обучающие материалы?
В разработке (TODO).

### Дополнительно
- Проблемы: [GitHub Issues](https://github.com/XavierCHN/x-template/issues)
- Запуск обычной Dota 2: `yarn launch do` или `yarn launch dop` для серверов Perfect World
