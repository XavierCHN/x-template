import * as ts from 'typescript';
import type { CompilerOptions, EmitHost, Plugin, ProcessedFile } from 'typescript-to-lua';

function afterPrint(
    program: ts.Program,
    options: CompilerOptions,
    emitHost: EmitHost,
    result: ProcessedFile[]
): void {
    for (const file of result) {
        const sourceFile = file.fileName;
        const normalized = sourceFile.replace(/\\/g, '/');

        const srcIndex = normalized.indexOf('/src/');
        let relativePath: string;
        if (srcIndex !== -1) {
            relativePath = normalized.substring(srcIndex + 1);
        } else {
            const parts = normalized.split('/');
            relativePath = parts[parts.length - 1];
        }

        relativePath = relativePath.replace(/\.ts$/, '.lua');

        const injection = `local ____fileName = "${relativePath}"
if not __TS__fileRegistry then __TS__fileRegistry = {} end
__TS__fileRegistry[tostring(getfenv(1))] = ____fileName
`;
        file.code = injection + file.code;
    }
}

const plugin: Plugin = {
    afterPrint,
};

export default plugin;
