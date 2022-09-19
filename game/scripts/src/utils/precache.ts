function precacheEveryResourceInKV(kvFileList: string[]) {}
function precacheResource(resourceList: string[]) {}
function precacheUnits(unitNamesList: string[]) {}
export default function Precache(context: CScriptPrecacheContext) {
    precacheResource([
        // 需要预载的所有资源
        '***.vpcf',
        '***.vsndevts',
        '***.vmdl',
    ]);
}
