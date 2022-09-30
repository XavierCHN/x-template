// 清理一下API不适用于dota2的部分
const fs = require(`fs-extra`);

// 移除index.ts
fs.removeSync(`game/scripts/src/server/index.ts`);

// 修改GameService里面的内容
const gameService = fs.readFileSync(`game/scripts/src/server/services/GameService.ts`, `utf8`);
const gameServiceNew = gameService
    .replace(`import type { CancelablePromise } from '../core/CancelablePromise';`, `\n`)
    .replace(/CancelablePromise/g, `Promise`);

// 输出所有API作为types
const apis = gameServiceNew.match(/url:\s*(['"][a-zA-Z0-9\/]+['"])/g);
const api_type_string = apis
    .map(api => {
        return api.replace(/url:\s*/g, ``);
    })
    .sort()
    .join(` | \n`);
fs.writeFileSync(`game/scripts/src/server/core/urls.ts`, `export type URLs = \n${api_type_string};\n`);

// 重新写入文件
fs.writeFileSync(`game/scripts/src/server/services/GameService.ts`, gameServiceNew);
