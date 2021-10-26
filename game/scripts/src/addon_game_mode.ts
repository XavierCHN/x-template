import { GameMode } from "./game_mode";

require('utils/aeslua');
require('utils/decrypt');

Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.Addon) {
    GameRules.Addon.Reload();
}