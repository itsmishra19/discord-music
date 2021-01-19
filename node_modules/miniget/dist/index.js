"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const url_1 = require("url");
const stream_1 = require("stream");
const httpLibs = { 'http:': http_1.default, 'https:': https_1.default };
const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
const retryStatusCodes = new Set([429, 503]);
// `request`, `response`, `abort`, left out, miniget will emit these.
const requestEvents = ['connect', 'continue', 'information', 'socket', 'timeout', 'upgrade'];
const responseEvents = ['aborted'];
Miniget.MinigetError = class MinigetError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
};
Miniget.defaultOptions = {
    maxRedirects: 10,
    maxRetries: 2,
    maxReconnects: 0,
    backoff: { inc: 100, max: 10000 },
};
function Miniget(url, options = {}) {
    var _a;
    const opts = Object.assign({}, Miniget.defaultOptions, options);
    const stream = new stream_1.PassThrough({ highWaterMark: opts.highWaterMark });
    stream.destroyed = stream.aborted = false;
    let activeRequest;
    let activeResponse;
    let activeDecodedStream;
    let redirects = 0;
    let retries = 0;
    let retryTimeout;
    let reconnects = 0;
    let contentLength;
    let acceptRanges = false;
    let rangeStart = 0, rangeEnd;
    let downloaded = 0;
    // Check if this is a ranged request.
    if ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Range) {
        let r = /bytes=(\d+)-(\d+)?/.exec(opts.headers.Range + '');
        if (r) {
            rangeStart = parseInt(r[1], 10);
            rangeEnd = parseInt(r[2], 10);
        }
    }
    // Add `Accept-Encoding` header.
    if (opts.acceptEncoding) {
        opts.headers = Object.assign({
            'Accept-Encoding': Object.keys(opts.acceptEncoding).join(', ')
        }, opts.headers);
    }
    const downloadHasStarted = () => activeDecodedStream && 0 < downloaded;
    const downloadComplete = () => !acceptRanges || downloaded == contentLength;
    const reconnect = (err) => {
        activeDecodedStream = null;
        retries = 0;
        let inc = opts.backoff.inc;
        let ms = Math.min(inc, opts.backoff.max);
        retryTimeout = setTimeout(doDownload, ms);
        stream.emit('reconnect', reconnects, err);
    };
    const reconnectIfEndedEarly = (err) => {
        if (options.method != 'HEAD' && !downloadComplete() && reconnects++ < opts.maxReconnects) {
            reconnect(err);
            return true;
        }
        return false;
    };
    const retryRequest = (retryOptions) => {
        if (stream.destroyed) {
            return false;
        }
        if (downloadHasStarted()) {
            return reconnectIfEndedEarly(retryOptions.err);
        }
        else if ((!retryOptions.statusCode || retryOptions.err.message === 'ENOTFOUND') &&
            retries++ < opts.maxRetries) {
            let ms = retryOptions.retryAfter ||
                Math.min(retries * opts.backoff.inc, opts.backoff.max);
            retryTimeout = setTimeout(doDownload, ms);
            stream.emit('retry', retries, retryOptions.err);
            return true;
        }
        return false;
    };
    const forwardEvents = (ee, events) => {
        for (let event of events) {
            ee.on(event, stream.emit.bind(stream, event));
        }
    };
    const doDownload = () => {
        let parsed, httpLib;
        try {
            parsed = url_1.parse(url);
            httpLib = httpLibs[parsed.protocol];
        }
        catch (err) {
            // Let the error be caught by the if statement below.
        }
        if (!httpLib) {
            stream.emit('error', new Miniget.MinigetError('Invalid URL: ' + url));
            return;
        }
        Object.assign(parsed, opts);
        if (acceptRanges && downloaded > 0) {
            let start = downloaded + rangeStart;
            let end = rangeEnd || '';
            parsed.headers = Object.assign({}, parsed.headers, {
                Range: `bytes=${start}-${end}`
            });
        }
        if (opts.transform) {
            try {
                parsed = opts.transform(parsed);
            }
            catch (err) {
                stream.emit('error', err);
                return;
            }
            if (!parsed || parsed.protocol) {
                httpLib = httpLibs[parsed === null || parsed === void 0 ? void 0 : parsed.protocol];
                if (!httpLib) {
                    stream.emit('error', new Miniget.MinigetError('Invalid URL object from `transform` function'));
                    return;
                }
            }
        }
        const onError = (err, statusCode) => {
            cleanup();
            if (!retryRequest({ err, statusCode })) {
                stream.emit('error', err);
            }
            else {
                activeRequest.removeListener('close', onRequestClose);
            }
        };
        const onRequestClose = () => {
            cleanup();
            retryRequest({});
        };
        const cleanup = () => {
            activeRequest.removeListener('error', onError);
            activeRequest.removeListener('close', onRequestClose);
            activeResponse === null || activeResponse === void 0 ? void 0 : activeResponse.removeListener('data', onData);
            activeDecodedStream === null || activeDecodedStream === void 0 ? void 0 : activeDecodedStream.removeListener('end', onEnd);
            activeDecodedStream === null || activeDecodedStream === void 0 ? void 0 : activeDecodedStream.removeListener('error', onError);
            activeResponse === null || activeResponse === void 0 ? void 0 : activeResponse.removeListener('error', onError);
        };
        const onData = (chunk) => { downloaded += chunk.length; };
        const onEnd = () => {
            cleanup();
            if (!reconnectIfEndedEarly()) {
                stream.end();
            }
        };
        activeRequest = httpLib.request(parsed, (res) => {
            // Needed for node v10, v12.
            // istanbul ignore next
            if (stream.destroyed) {
                return;
            }
            if (redirectStatusCodes.has(res.statusCode)) {
                if (redirects++ >= opts.maxRedirects) {
                    stream.emit('error', new Miniget.MinigetError('Too many redirects'));
                }
                else {
                    url = res.headers.location;
                    setTimeout(doDownload, res.headers['retry-after'] ? parseInt(res.headers['retry-after'], 10) * 1000 : 0);
                    stream.emit('redirect', url);
                }
                return cleanup();
                // Check for rate limiting.
            }
            else if (retryStatusCodes.has(res.statusCode)) {
                if (!retryRequest({ retryAfter: parseInt(res.headers['retry-after'], 10) })) {
                    let err = new Miniget.MinigetError('Status code: ' + res.statusCode, res.statusCode);
                    stream.emit('error', err);
                }
                return cleanup();
            }
            else if (res.statusCode < 200 || 400 <= res.statusCode) {
                let err = new Miniget.MinigetError('Status code: ' + res.statusCode, res.statusCode);
                if (res.statusCode >= 500) {
                    onError(err, res.statusCode);
                }
                else {
                    stream.emit('error', err);
                }
                return cleanup();
            }
            activeDecodedStream = res;
            if (opts.acceptEncoding && res.headers['content-encoding']) {
                for (let enc of res.headers['content-encoding'].split(', ').reverse()) {
                    let fn = opts.acceptEncoding[enc];
                    if (fn != null) {
                        activeDecodedStream = activeDecodedStream.pipe(fn());
                        activeDecodedStream.on('error', onError);
                    }
                }
            }
            if (!contentLength) {
                contentLength = parseInt(res.headers['content-length'] + '', 10);
                acceptRanges = res.headers['accept-ranges'] === 'bytes' &&
                    contentLength > 0 && opts.maxReconnects > 0;
            }
            res.on('data', onData);
            activeDecodedStream.on('end', onEnd);
            activeDecodedStream.pipe(stream, { end: !acceptRanges });
            activeResponse = res;
            stream.emit('response', res);
            res.on('error', onError);
            forwardEvents(res, responseEvents);
        });
        activeRequest.on('error', onError);
        activeRequest.on('close', onRequestClose);
        forwardEvents(activeRequest, requestEvents);
        if (stream.destroyed) {
            streamDestroy(destroyErr);
        }
        stream.emit('request', activeRequest);
        activeRequest.end();
    };
    stream.abort = (err) => {
        console.warn('`MinigetStream#abort()` has been deprecated in favor of `MinigetStream#destroy()`');
        stream.aborted = true;
        stream.emit('abort');
        stream.destroy(err);
    };
    let destroyErr;
    const streamDestroy = (err) => {
        activeRequest.destroy(err);
        activeDecodedStream === null || activeDecodedStream === void 0 ? void 0 : activeDecodedStream.unpipe(stream);
        activeDecodedStream === null || activeDecodedStream === void 0 ? void 0 : activeDecodedStream.destroy();
        clearTimeout(retryTimeout);
    };
    stream._destroy = (err) => {
        stream.destroyed = true;
        if (activeRequest) {
            streamDestroy(err);
        }
        else {
            destroyErr = err;
        }
    };
    stream.text = () => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let body = '';
            stream.setEncoding('utf8');
            stream.on('data', (chunk) => body += chunk);
            stream.on('end', () => resolve(body));
            stream.on('error', reject);
        });
    });
    process.nextTick(doDownload);
    return stream;
}
module.exports = Miniget;
//# sourceMappingURL=index.js.map