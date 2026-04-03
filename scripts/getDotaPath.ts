import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

export default (): string | undefined => {
    if (process.platform !== 'win32') {
        return undefined;
    }

    try {
        const output = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Valve\\Steam\\Apps\\570" /v InstallLocation', {
            encoding: 'utf-8',
        });
        const match = output.match(/REG_SZ\s+(.+)/);
        if (match && match[1]) {
            return match[1].trim();
        }
    } catch {
        // ignore
    }

    try {
        const steamPathOutput = execSync('reg query "HKEY_CURRENT_USER\\SOFTWARE\\Valve\\Steam" /v SteamPath', { encoding: 'utf-8' });
        const steamPathMatch = steamPathOutput.match(/REG_SZ\s+(.+)/);
        if (steamPathMatch && steamPathMatch[1]) {
            const steamPath = steamPathMatch[1].trim();
            const libraryFoldersPath = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');
            if (fs.existsSync(libraryFoldersPath)) {
                const content = fs.readFileSync(libraryFoldersPath, 'utf-8');
                const pathMatches = content.match(/"path"\s+"([^"]+)"/g);
                if (pathMatches) {
                    for (const pm of pathMatches) {
                        const rawPath = pm.match(/"path"\s+"([^"]+)"/)?.[1];
                        if (rawPath) {
                            const libPath = rawPath.replace(/\\\\/g, '\\');
                            const appManifestPath = path.join(libPath, 'steamapps', 'appmanifest_570.acf');
                            if (fs.existsSync(appManifestPath)) {
                                return path.join(libPath, 'steamapps', 'common', 'dota 2 beta');
                            }
                        }
                    }
                }
            }
        }
    } catch {
        // ignore
    }

    return undefined;
};
