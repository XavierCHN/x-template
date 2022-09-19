import 'utils/index';
import { ActivateAllModules, ReloadAllModules } from './modules';
import Precache from './utils/precache';

Object.assign(getfenv(), {
    Activate: () => {
        ActivateAllModules();
    },
    Precache: Precache,
});

ReloadAllModules();
