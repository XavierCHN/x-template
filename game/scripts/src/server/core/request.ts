/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { ApiRequestOptions } from './ApiRequestOptions';
import { Headers, NoSignatureURLs, OpenAPIConfig } from './OpenAPI';

const isDefined = <T>(value: T | null | undefined): boolean => {
    return value !== undefined && value !== null;
};

const isString = (value: any): value is string => {
    return typeof value === 'string';
};

const getQueryString = (params: Record<string, any>): string => {
    const qs: string[] = [];

    const append = (key: string, value: any) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(tostring(value))}`);
    };

    const process = (key: string, value: any) => {
        if (isDefined(value)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    process(key, v);
                });
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => {
                    process(`${key}[${k}]`, v);
                });
            } else {
                append(key, value);
            }
        }
    };

    Object.entries(params).forEach(([key, value]) => {
        process(key, value);
    });

    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }

    return '';
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
    const path = options.url
        .replace('{api-version}', config.VERSION);

    const url = `${config.BASE}${path}`;
    if (options.query) {
        return `${url}${getQueryString(options.query)}`;
    }
    return url;
};

const getHeaders = (config: OpenAPIConfig, options: ApiRequestOptions): Record<string, string> => {
    const headers = Object.entries({
        Accept: 'application/json',
        ...config.HEADERS,
        ...options.headers,
    })
        .filter(([_, value]) => isDefined(value))
        .reduce((headers, [key, value]) => ({
            ...headers,
            [key]: tostring(value),
        }), {} as Record<string, string>);

    if (options.body) {
        if (options.mediaType) {
            headers['Content-Type'] = options.mediaType;
        } else if (isString(options.body)) {
            headers['Content-Type'] = 'text/plain';
        }
    }

    return headers;
};

const getRequestBody = (options: ApiRequestOptions): any => {
    if (options.body) {
        if (options.mediaType?.includes('/json')) {
            return json.encode(options.body);
        } else if (isString(options.body)) {
            return options.body;
        } else {
            return json.encode(options.body);
        }
    }
    return undefined;
};

const throwError = (result: CScriptHTTPResponse): void => {
    const errors: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable'
    };

    const __error = errors[result.StatusCode];
    if (__error) {
        error(__error);
    }

    if (result.StatusCode != 200) {
        // error(`Generic Error: ${result.StatusCode}`);
    }
};

export const sendRequest = async (
    config: OpenAPIConfig,
    options: ApiRequestOptions,
    url: string,
    body: any,
    headers: Headers,
    sign: boolean,
    authKey: string
): Promise<CScriptHTTPResponse> => {
    let request = CreateHTTPRequestScriptVM(
        options.method,
        url
    );

    for (const [k, v] of Object.entries(headers)) {
        request.SetHTTPRequestHeaderValue(k, v);
    }

    // 之前加signature的方法错了
    if (sign) {
        const signature = SHA.sha3_512(authKey + (body ?? `{}`));
        request.SetHTTPRequestHeaderValue(`dota-signature`, signature);
    }

    if (body != undefined) request.SetHTTPRequestRawPostBody(options.mediaType ?? `application/json`, body);
    request.SetHTTPRequestAbsoluteTimeoutMS(config.ABSOLUTE_TIMEOUT);
    request.SetHTTPRequestNetworkActivityTimeout(config.NETWORK_ACTIVITY_TIMEOUT);
    const send = () => {
        return new Promise<CScriptHTTPResponse>((resolve, reject) => {
            request.Send(result => {
                resolve(result);
            });
        });
    };
    return await send();
};

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions): Promise<T> => {
    return new Promise(async (resolve, reject) => {
        try {
            const url = getUrl(config, options);
            const body = getRequestBody(options);
            const headers = getHeaders(config, options);

            const should_sign = !NoSignatureURLs.includes(options.url);
            const response = await sendRequest(config, options, url, body, headers, should_sign, config.AUTHKEY);

            throwError(response);

            // 如果body包含error code，那么throw之
            if (response.Body) {
                try {
                    let data = JSON.decode(response.Body);
                    if (data && data.state == `ERROR`) {
                        // reject(`${data.errorCode ?? `UNKNOWN ERROR CODE`} : ${data.errorMessage ?? 'No Message'}`);
                        reject({ errorCode: data.errorCode ?? `UNKNOWN ERROR CODE`, errorMessage: data.errorMessage ?? 'No Message' });
                    } else {
                        if (data != null) resolve(data);
                    }
                } catch (e) {
                    reject(e);
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
