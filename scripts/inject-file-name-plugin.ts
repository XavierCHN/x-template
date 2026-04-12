import * as ts from 'typescript';
import * as tstl from 'typescript-to-lua';
import * as lua from 'typescript-to-lua/dist/LuaAST.js';

/**
 * 检查节点是否是 registerModifier 或 registerAbility 的调用
 */
function isRegisterCall(node: ts.Node): boolean {
    if (!ts.isCallExpression(node)) {
        return false;
    }
    const expression = node.expression;
    if (ts.isIdentifier(expression)) {
        return expression.text === 'registerModifier' || expression.text === 'registerAbility';
    }
    return false;
}

/**
 * 创建 Lua 的 getfenv(1) 调用表达式
 */
function createGetfenvLuaCall(tsOriginal: ts.Node): lua.CallExpression {
    return lua.createCallExpression(
        lua.createIdentifier('getfenv'),
        [lua.createNumericLiteral(1, tsOriginal)],
        tsOriginal
    );
}

/**
 * 访问者函数：处理 CallExpression 节点
 */
function callExpressionVisitor(node: ts.CallExpression, context: tstl.TransformationContext) {
    // 检查是否是 registerModifier 或 registerAbility 调用
    if (!isRegisterCall(node)) {
        // 不是目标调用，使用默认转换
        return context.superTransformExpression(node);
    }

    const sourceFile = node.getSourceFile();
    if (!sourceFile) {
        return context.superTransformExpression(node);
    }

    const sourceFilePath = sourceFile.fileName;
    const normalized = sourceFilePath.replace(/\\/g, '/');

    const srcIndex = normalized.indexOf('/src/');
    let relativePath: string;
    if (srcIndex !== -1) {
        relativePath = normalized.substring(srcIndex + 5); // 去掉 /src/
    } else {
        const parts = normalized.split('/');
        relativePath = parts[parts.length - 1];
    }

    relativePath = relativePath.replace(/\.ts$/, '.lua');

    // 转换原始的参数
    const transformedArguments = node.arguments.map(arg => context.transformExpression(arg));

    // 确保参数列表有正确的长度：
    // 参数1: name（如果用户提供了就保留，否则为 nil）
    // 参数2: filePath（如果用户没有提供，自动注入）
    // 参数3: env（如果用户没有提供，自动注入 getfenv(1)）

    // TSTL 编译的箭头函数会自动添加 ____ 参数（用于 this）
    // 所以我们需要在参数列表开头插入一个 nil 来占位
    if (transformedArguments.length === 0) {
        transformedArguments.push(lua.createNilLiteral()); // ____ 占位
        transformedArguments.push(lua.createNilLiteral()); // name
    } else if (transformedArguments.length === 1) {
        // 用户提供了 name，需要插入 ____ 占位
        transformedArguments.unshift(lua.createNilLiteral());
    }

    // 如果用户没有提供 filePath，注入文件路径
    if (transformedArguments.length < 3) {
        transformedArguments.push(lua.createStringLiteral(relativePath));
    }

    // 如果用户没有提供 env，注入 getfenv(1)
    if (transformedArguments.length < 4) {
        transformedArguments.push(createGetfenvLuaCall(node));
    }

    // 创建 Lua 调用表达式
    const expression = lua.createIdentifier((node.expression as ts.Identifier).text);
    return lua.createCallExpression(expression, transformedArguments, node);
}

const plugin: tstl.Plugin = {
    visitors: {
        [ts.SyntaxKind.CallExpression]: callExpressionVisitor as any,
    },
};

export default plugin;
