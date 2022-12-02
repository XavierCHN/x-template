// a simple http file server to use in development mode
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import bodyParser from 'body-parser';

const app = express();
// the root directory should be the project root, so we can save to content and game directories
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.post('/write', (req, res) => {
    try {
        const curdir = process.cwd();
        let { file, content } = req.body;
        console.log('dev server trying to write file', file);
        fs.writeFileSync(path.join(curdir, file), content);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send('error');
    }
});

app.post('/read', (req, res) => {
    try {
        const curdir = process.cwd();
        const { file } = req.body;
        console.log('dev server trying to read file', file);
        let content = fs.readFileSync(path.join(curdir, file), 'utf8');
        res.json({ content });
    } catch (err) {
        console.log(err);
        res.status(500).send('error');
    }
});

export default app;
