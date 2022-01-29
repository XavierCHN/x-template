const config = require("../config").IcToolsConfig.ImageCompile;

const preloadImagesFolder = config.Folders;

const dotaPath = "file://{%type%}";

const dotaImagesPath = dotaPath.replace("%type%", "images");

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const contentDirPath = path.resolve(__dirname, "../../../content");

const tempele = path.join(__dirname, "images_precache_template.ejs");

const root = path.join(contentDirPath, "panorama/images");

const imagesFiles = [];

function _startWatch() {
    console.log("Watch in Images .......",root)
    
    if (!fs.existsSync(root))
        fs.mkdirSync(root,{recursive :true});

    fs.watch(root, { recursive: true }, event => {
        try {
            console.log("Generate preload xml......")
            _execute();
        } catch (e) {}
    });
}

function _stopWatch() {
    fs.unwatchFile(root);
}

function _execute() {
    imagesFiles.length = 0;

    for (let folder of preloadImagesFolder) {
        const dirPath = path.join(root, folder);

        if (!fs.existsSync(dirPath))
            continue;

        _searchFiles(dirPath, folder);
    }

    const saveDir = path.join(contentDirPath, "panorama/layout/custom_game");

    const savePath = path.join(saveDir, "images_precache.xml");

    try {
        ejs.renderFile(tempele, { files: imagesFiles }, (err, data) => {
            if (err != null)
                console.error(err.message)
            else
                fs.writeFileSync(savePath, data);
        });
    } catch (e) {
        // console.log("生成失败.错误在下面")
        // console.log(e)
    }
}

function _searchFiles(dPath:string, basePath:string) {
    const dir = fs.readdirSync(dPath);

    for (let name of dir) {
        const fPath = path.join(dPath, name);

        const stats = fs.statSync(fPath);

        if (stats.isDirectory()) {
            _searchFiles(fPath, `${basePath}/${name}`)
        } else {
            if (!name.endsWith(".png"))
                continue;

            imagesFiles.push(`${dotaImagesPath}/${basePath}/${name}`);
        }
    }
}

process.on('SIGINT', function() {
    _stopWatch();
    process.exit();
});

if (process.argv.length >= 3) {
    const args = process.argv.slice(2)
    if (args[0].toLowerCase() === "watch") {
        _startWatch();
    }
}

_execute();
