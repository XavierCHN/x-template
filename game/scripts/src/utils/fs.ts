/**
 * a custom fs to read/write files via http request
 * please ensure your file server is running
 * see @ gulpfile.ts @task start_file_server
 * 一个使用本地http请求读写文件的fs
 * 请确保你的文件服务器正在运行
 * 参见 @ gulpfile.ts @task start_file_server
 *
 * @example
 *    fs.read('./game/scripts/src/addon_game_mode.ts').then(content => {
 *        print(content);
 *    });
 *    fs.write('./game/scripts/src/test.ts', 'to be or not to be, it is a problem\r\n');
 * */
export class fs {
    public static request(method: 'PUT' | 'GET' | 'POST', url: string) {
        const request = CreateHTTPRequestScriptVM(method, `http://localhost:10384${url}`);
        return request;
    }

    public static dir(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.request('GET', path).Send(result => {
                if (result.StatusCode !== 200) {
                    reject(result.Body);
                } else {
                    resolve(JSON.decode(result.Body));
                }
            });
        });
    }

    public static read(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.request('GET', path).Send(result => {
                if (result.StatusCode !== 200) {
                    reject(result.Body);
                } else {
                    resolve(result.Body);
                }
            });
        });
    }

    public static write(path: string, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = fs.request('PUT', path);
            request.SetHTTPRequestRawPostBody('application/json', content);
            request.Send(result => {
                if (result.StatusCode !== 200) {
                    reject(result.Body);
                } else {
                    resolve();
                }
            });
        });
    }

    public static mkdir(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.request('POST', path).Send(result => {
                if (result.StatusCode !== 200) {
                    reject(result.Body);
                } else {
                    resolve();
                }
            });
        });
    }
}
