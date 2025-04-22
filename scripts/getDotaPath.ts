// 使用 ES 模块导入
import { getGamePath } from 'steam-game-path';

// 定义函数并指定返回类型
export default async (): Promise<string> => {
    const gameInfo = getGamePath(570);
    return gameInfo!.game!.path;
};
