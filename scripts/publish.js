"use strict";

const walk = require("walk");
const fs = require("fs");
const anyMatch = require("anymatch");
const path = require("path");

const packageJson = require("../package.json");
const settings = packageJson.dota_developer.publish_options;
const walker = walk.walk("game");
const excludeFiles = settings.excludeFiles;
const encryptFiles = settings.encryptFiles;
const dedicatedServerKey = settings.encryptDedicatedServerKey;
const exec = require("child_process").exec;

const getPublishPath = (source) => source.replace(/^game/, "publish");

walker.on("file", (root, fileStats, next) => {
    const fileName = path.join(root, fileStats.name);
    if (anyMatch(excludeFiles, fileName)) {
        // ignore the files we dont want to publish
        console.log(`[publish.js] ignore filtered file ->${fileName}`);
    } else {
        if (!fs.existsSync(getPublishPath(root))) {
            fs.mkdirSync(getPublishPath(root), { recursive: true });
            console.log(`[publish.js] [create-path] ->${root}`);
        }
        if (anyMatch(encryptFiles, fileName)) {
            exec(`lua scripts/encrypt_file.lua "${fileName}" "${getPublishPath(fileName)}" ${dedicatedServerKey}`, (err, out) => {
                if (err) console.error(`[publish.js] [encrypt] ->${fileName}`, err);
                if (!err) {
                    console.log(`[publish.js] [encrypt] ->${fileName} successed with key ${dedicatedServerKey}`);
                }
            });
        } else {
            console.log(`[publish.js] [copy] ->${fileName}`);
            fs.copyFileSync(fileName, getPublishPath(fileName));
        }
    }
    next();
});
