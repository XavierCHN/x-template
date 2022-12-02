/** xio to read/save file to the project
 * the root directory should be the project root, so we can save to content and game directories
 * the default path is 10384, if there is a conflict, you can change it
 * but remember to also change the port in gulpfile.ts
 * @example
 *     xio.save('content/panorama/scripts/custom_game/test.txt', 'hello world');
 *     xio.read('content/panorama/scripts/custom_game/test.txt').then((content) => { console.log(content); });
 */
const port = 10384;

export class xio {
    public static read(file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let req = CreateHTTPRequestScriptVM('POST', `http://localhost:${port}/read`);
            req.SetHTTPRequestGetOrPostParameter('file', file);
            req.Send(response => {
                print(`response.StatusCode: ${response.StatusCode}`);
                if (response.StatusCode === 200) {
                    let data = JSON.decode(response.Body);
                    resolve(data.content);
                } else {
                    reject(response.Body);
                }
            });
        });
    }
    public static write(file: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            print(`xio.write: ${file}`);
            let req = CreateHTTPRequestScriptVM('POST', `http://localhost:${port}/write`);
            req.SetHTTPRequestHeaderValue('Content-Type', 'application/json');
            req.SetHTTPRequestGetOrPostParameter('file', file);
            req.SetHTTPRequestGetOrPostParameter('content', content);
            req.Send(response => {
                print(`response.StatusCode: ${response.StatusCode}`);
                if (response.StatusCode === 200) {
                    resolve();
                } else {
                    reject(response.Body);
                }
            });
        });
    }
}
