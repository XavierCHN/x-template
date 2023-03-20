import type * as ts from 'typescript';
import type * as tstl from 'typescript-to-lua';

import { addon_name } from '../addon.config';

const plugin: tstl.Plugin = {
    beforeEmit(program: ts.Program, options: tstl.CompilerOptions, emitHost: tstl.EmitHost, result: tstl.EmitFile[]) {
        void program;
        void options;
        void emitHost;
        console.log(`x-template compiling ${result.length} ts files...`);
        for (const file of result) {
            // @ts-expect-error
            const name = file.fileName;
            if (name.endsWith(`addon_game_mode.ts`)) {
                // add the compiled timestamp to the top of the file
                const date = new Date();
                const timestamp = `${date.getFullYear()}-${
                    date.getMonth() + 1
                }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                file.code = `print('loading addon ${addon_name} compiled@${timestamp}')\n${file.code}`;
            }
        }
    },
};

export default plugin;
