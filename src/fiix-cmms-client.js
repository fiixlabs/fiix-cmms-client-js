/*
 Below is the crypto-js 3.1.2 rollup "hmac-sha256.js", aliased so as not to conflict with other possible crypto-js uses.
 The rollup includes "hmac-sha256" algorithm, and Hex encoder, which is all we need at this time.
 Included this way, without requires() and such, the thingy will work both in Node.js and the browser.
 Do see the licensing info.
 */

/*
 CryptoJS v3.1.2
 code.google.com/p/crypto-js
 (c) 2009-2013 by Jeff Mott. All rights reserved.
 code.google.com/p/crypto-js/wiki/License
 */
var FiixCmmsClient_CryptoJS = FiixCmmsClient_CryptoJS || function (h, s) {
    var f = {},
        g = f.lib = {},
        q = function () {},
        m = g.Base = {
            extend: function (a) {
                q.prototype = this;
                var c = new q;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function () {
                    c.$super.init.apply(this, arguments)
                });
                c.init.prototype = c;
                c.$super = this;
                return c
            },
            create: function () {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function () {},
            mixIn: function (a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function () {
                return this.init.prototype.extend(this)
            }
        },
        r = g.WordArray = m.extend({
            init: function (a, c) {
                a = this.words = a || [];
                this.sigBytes = c != s ? c : 4 * a.length
            },
            toString: function (a) {
                return (a || k).stringify(this)
            },
            concat: function (a) {
                var c = this.words,
                    d = a.words,
                    b = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (b % 4)
                    for (var e = 0; e < a; e++) c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4);
                else if (65535 < d.length)
                    for (e = 0; e < a; e += 4) c[b + e >>> 2] = d[e >>> 2];
                else c.push.apply(c, d);
                this.sigBytes += a;
                return this
            },
            clamp: function () {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = h.ceil(c / 4)
            },
            clone: function () {
                var a = m.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function (a) {
                for (var c = [], d = 0; d < a; d += 4) c.push(4294967296 * h.random() | 0);
                return new r.init(c, a)
            }
        }),
        l = f.enc = {},
        k = l.Hex = {
            stringify: function (a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) {
                    var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                    d.push((e >>> 4).toString(16));
                    d.push((e & 15).toString(16))
                }
                return d.join("")
            },
            parse: function (a) {
                for (var c = a.length, d = [], b = 0; b < c; b += 2) d[b >>> 3] |= parseInt(a.substr(b,
                    2), 16) << 24 - 4 * (b % 8);
                return new r.init(d, c / 2)
            }
        },
        n = l.Latin1 = {
            stringify: function (a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
                return d.join("")
            },
            parse: function (a) {
                for (var c = a.length, d = [], b = 0; b < c; b++) d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
                return new r.init(d, c)
            }
        },
        j = l.Utf8 = {
            stringify: function (a) {
                try {
                    return decodeURIComponent(escape(n.stringify(a)))
                } catch (c) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function (a) {
                return n.parse(unescape(encodeURIComponent(a)))
            }
        },
        u = g.BufferedBlockAlgorithm = m.extend({
            reset: function () {
                this._data = new r.init;
                this._nDataBytes = 0
            },
            _append: function (a) {
                "string" == typeof a && (a = j.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function (a) {
                var c = this._data,
                    d = c.words,
                    b = c.sigBytes,
                    e = this.blockSize,
                    f = b / (4 * e),
                    f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);
                a = f * e;
                b = h.min(4 * a, b);
                if (a) {
                    for (var g = 0; g < a; g += e) this._doProcessBlock(d, g);
                    g = d.splice(0, a);
                    c.sigBytes -= b
                }
                return new r.init(g, b)
            },
            clone: function () {
                var a = m.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    g.Hasher = u.extend({
        cfg: m.extend(),
        init: function (a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function () {
            u.reset.call(this);
            this._doReset()
        },
        update: function (a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function (a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function (a) {
            return function (c, d) {
                return (new a.init(d)).finalize(c)
            }
        },
        _createHmacHelper: function (a) {
            return function (c, d) {
                return (new t.HMAC.init(a,
                    d)).finalize(c)
            }
        }
    });
    var t = f.algo = {};
    return f
}(Math);
(function (h) {
    for (var s = FiixCmmsClient_CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function (a) {
        return 4294967296 * (a - (a | 0)) | 0
    }, k = 2, n = 0; 64 > n;) {
        var j;
        a: {
            j = k;
            for (var u = h.sqrt(j), t = 2; t <= u; t++)
                if (!(j % t)) {
                    j = !1;
                    break a
                }
            j = !0
        }
        j && (8 > n && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++);
        k++
    }
    var a = [],
        f = f.SHA256 = q.extend({
            _doReset: function () {
                this._hash = new g.init(m.slice(0))
            },
            _doProcessBlock: function (c, d) {
                for (var b = this._hash.words, e = b[0], f = b[1], g = b[2], j = b[3], h = b[4], m = b[5], n = b[6], q = b[7], p = 0; 64 > p; p++) {
                    if (16 > p) a[p] =
                        c[d + p] | 0;
                    else {
                        var k = a[p - 15],
                            l = a[p - 2];
                        a[p] = ((k << 25 | k >>> 7) ^ (k << 14 | k >>> 18) ^ k >>> 3) + a[p - 7] + ((l << 15 | l >>> 17) ^ (l << 13 | l >>> 19) ^ l >>> 10) + a[p - 16]
                    }
                    k = q + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & m ^ ~h & n) + r[p] + a[p];
                    l = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f ^ e & g ^ f & g);
                    q = n;
                    n = m;
                    m = h;
                    h = j + k | 0;
                    j = g;
                    g = f;
                    f = e;
                    e = k + l | 0
                }
                b[0] = b[0] + e | 0;
                b[1] = b[1] + f | 0;
                b[2] = b[2] + g | 0;
                b[3] = b[3] + j | 0;
                b[4] = b[4] + h | 0;
                b[5] = b[5] + m | 0;
                b[6] = b[6] + n | 0;
                b[7] = b[7] + q | 0
            },
            _doFinalize: function () {
                var a = this._data,
                    d = a.words,
                    b = 8 * this._nDataBytes,
                    e = 8 * a.sigBytes;
                d[e >>> 5] |= 128 << 24 - e % 32;
                d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);
                d[(e + 64 >>> 9 << 4) + 15] = b;
                a.sigBytes = 4 * d.length;
                this._process();
                return this._hash
            },
            clone: function () {
                var a = q.clone.call(this);
                a._hash = this._hash.clone();
                return a
            }
        });
    s.SHA256 = q._createHelper(f);
    s.HmacSHA256 = q._createHmacHelper(f)
})(Math);
(function () {
    var h = FiixCmmsClient_CryptoJS,
        s = h.enc.Utf8;
    h.algo.HMAC = h.lib.Base.extend({
        init: function (f, g) {
            f = this._hasher = new f.init;
            "string" == typeof g && (g = s.parse(g));
            var h = f.blockSize,
                m = 4 * h;
            g.sigBytes > m && (g = f.finalize(g));
            g.clamp();
            for (var r = this._oKey = g.clone(), l = this._iKey = g.clone(), k = r.words, n = l.words, j = 0; j < h; j++) k[j] ^= 1549556828, n[j] ^= 909522486;
            r.sigBytes = l.sigBytes = m;
            this.reset()
        },
        reset: function () {
            var f = this._hasher;
            f.reset();
            f.update(this._iKey)
        },
        update: function (f) {
            this._hasher.update(f);
            return this
        },
        finalize: function (f) {
            var g =
                this._hasher;
            f = g.finalize(f);
            g.reset();
            return g.finalize(this._oKey.clone().concat(f))
        }
    })
})();

/**
 *    Ta-da.
 * @constructor
 */
var FiixCmmsClient = function () {
    function init() {
        if(typeof XMLHttpRequest === "function"){
            useXhr = true;
            useNode = false;
        }
        else if(typeof XMLHttpRequest === "object"){ // PhantomJS?
            useXhr = true;
            useNode = false;
        }
        else if(typeof require == "function" && require){
            useXhr = false;
            useNode = true;
        }
        else{
            //  WTF
        }
    }

    /**
     * This is the request counter.
     */
    var requestId = 0,
        /**
         * See Gruntfile.js & getClientVersion()
         */
        MAGICK_I_HAZ_A_VERSION = "2.3.1", // Note Gulpfile is looking for this string!
        clientVersionString = MAGICK_I_HAZ_A_VERSION, // See Gruntfile.js & getClientVersion()
        clientVersion = null,
        /**
         *    This defines how our JSON parser will interpret the request
         */
        C_MAGICK_API_OBJECT_JSON_FIELD_NAME = "_maCn",
        C_CALLBACK = "callback",
        C_CLASS_NAME = "className",
        C_OBJECT = "object",
        baseUri = "/api/",
        pKey,
        authToken,
        appKey,
        syncRev,
        signMessages = true,
        timeoutMs = 30000,
        permissionsDescriptor,
        permissionsDescriptorLastFetchUnixTime,
        PERMISSIONS_REFRESH_PERIOD_MS = 600000,
        useXhr = false, // Use XMLHttpRequest
        useNode = false, // Use Node.js 'http'/'https'
        tehInit = init(); // Make sure init() is invoked

    function getClientVersion() {
        if (clientVersion == null) {
            if (MAGICK_I_HAZ_A_VERSION === clientVersionString) {
                //	This is when running off the sorce, in DEV
                clientVersion = {
                    "major": 2,
                    "minor": 3,
                    "patch": 1,
                    "preRelease": "alpha",
                    "metadata": null
                };
            } else {
                //	TODO process the preRelease and metadata
                var arr = clientVersionString.split(".");
                var major = parseInt(arr[0]);
                var minor = parseInt(arr[1]);
                var patch = parseInt(arr[2]);

                clientVersion = {
                    "major": major,
                    "minor": minor,
                    "patch": patch
                };
            }
        }

        return clientVersion;
    }

    function setUseXhr(b){
        useXhr = b;
        useNode = !b;
    }

    function setUseNode(b){
        useXhr = !b;
        useNode = b;
    }

    function getTimeoutMs() {
        return timeoutMs;
    }

    function setTimeoutMs(ms) {
        timeoutMs = ms;
    }

    function getBaseUri() {
        return baseUri;
    }

    function setBaseUri(uri) {
        baseUri = uri;
    }

    /**
     * You can disable signing of messages. This is used, e.g. for making "guest" (non-authorized) requests.
     * @param {boolean} sm
     */
    function setSignMessages(sm) {
        signMessages = sm;
    }

    function setPKey(p) {
        pKey = p;
    }

    function setAppKey(p) {
        appKey = p;
    }

    function setSyncRev(p) {
        syncRev = p;
    }

    function setAuthToken(at) {
        authToken = at;
    }

    function setMaConnectJsonParseFunction(func) {
        parseMaConnectJsonResponse = func;
    }

    function parseMaConnectJsonResponse(responseText) {
        return JSON.parse(responseText);
    }

    function getUtcTime() {
        var now = new Date();

        var utc = new Date(Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
        ));

        return utc.getTime();
    }

    function calcWOFileURI(woid) {

        var tmpDate = new Date();
        var yyyy = tmpDate.getFullYear().toString();
        var mm = (tmpDate.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = tmpDate.getDate().toString();
        var tmpDateStr = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding

        var hash = FiixCmmsClient_CryptoJS.SHA256("2EHmD0NNcrcQ" + woid + tmpDateStr);
        var encodedHash = FiixCmmsClient_CryptoJS.enc.Hex.stringify(hash).toLowerCase();

        return getBaseUri() + "wo-req-upload/" + woid + "?sh=" + encodedHash;
    }


    function calcFileUploadURI() {
        var ret = {};

        ret.endpoint = getBaseUri();
        ret.endpoint += "upload";
        ret.queryString = "";
        ret.queryString += "action=" + encodeURIComponent("upload");
        ret.queryString += "&service=" + encodeURIComponent("cmms");
        ret.queryString += "&accessKey=" + encodeURIComponent(authToken);
        ret.queryString += "&appKey=" + encodeURIComponent(appKey);
        ret.queryString += "&timestamp=" + encodeURIComponent(getUtcTime());
        ret.queryString += "&signatureVersion=1";
        ret.queryString += "&signatureMethod=HmacSHA256";

        ret.uri = ret.endpoint + "?" + ret.queryString;

        ret.headers = [
            {
                key: "Content-Type",
                value: "text/plain"
                }
            ];

        if (signMessages) {
            ret.signature = calcSignature(ret);
            ret.headers.push({
                key: "Authorization",
                value: ret.signature
            });
        }

        return ret.endpoint + "?" + ret.queryString + "&sig=" + ret.signature;

    }

    function calcFileURI(fileId) {
        var ret = {};

        ret.endpoint = getBaseUri();
        ret.endpoint += "download/" + fileId;
        ret.queryString = "";
        ret.queryString += "action=" + encodeURIComponent("download");
        ret.queryString += "&service=" + encodeURIComponent("cmms");
        ret.queryString += "&accessKey=" + encodeURIComponent(authToken);
        ret.queryString += "&appKey=" + encodeURIComponent(appKey);
        ret.queryString += "&timestamp=" + encodeURIComponent(getUtcTime());
        ret.queryString += "&signatureVersion=1";
        ret.queryString += "&signatureMethod=HmacSHA256";

        ret.uri = ret.endpoint + "?" + ret.queryString;

        ret.headers = [
            {
                key: "Content-Type",
                value: "text/plain"
                }
            ];

        if (signMessages) {
            ret.signature = calcSignature(ret);
            ret.headers.push({
                key: "Authorization",
                value: ret.signature
            });
        }

        return ret.endpoint + "?" + ret.queryString + "&sig=" + ret.signature;
    }

    function calcTransportParameters(action) {
        var ret = {};

        ret.endpoint = getBaseUri();

        ret.queryString = "";
        ret.queryString += "action=" + encodeURIComponent(action);
        ret.queryString += "&service=" + encodeURIComponent("cmms");
        ret.queryString += "&accessKey=" + encodeURIComponent(authToken);
        ret.queryString += "&appKey=" + encodeURIComponent(appKey);
        ret.queryString += (syncRev && syncRev.revision) ? "&syncRev=" + encodeURIComponent(syncRev.revision): "";
        ret.queryString += "&timestamp=" + encodeURIComponent(getUtcTime());
        ret.queryString += "&signatureVersion=1";
        ret.queryString += "&signatureMethod=HmacSHA256";

        ret.uri = ret.endpoint + "?" + ret.queryString;

        ret.headers = [
            {
                key: "Content-Type",
                value: "text/plain"
                }
            ];

        if (signMessages) {
            ret.signature = calcSignature(ret);
            ret.headers.push({
                key: "Authorization",
                value: ret.signature
            });
        }

        return ret;
    }

    function calcSignature(tp) {
        if (!pKey) {
            throw "Error: you need to provide credentials."
        }

        var message = tp.uri;

        //	Cut out the protocol part
        if (message.indexOf("http://") == 0) {
            message = message.substring("http://".length);
        } else if (message.indexOf("https://") == 0) {
            message = message.substring("https://".length);
        }

        var mac = FiixCmmsClient_CryptoJS.HmacSHA256(message, pKey);
        var encodedMac = FiixCmmsClient_CryptoJS.enc.Hex.stringify(mac).toLowerCase();

        return encodedMac;
    }

    function createError_ParsingResponse(e) {
        var error = {
            leg: "CLIENT_REQUEST_SEND_OR_RECEIVE",
            code: 100,
            message: "Error while parsing the response",
            stackTrace: (e ? e.toString() : "")
        };
        return error;
    }

    function createError_HttpStatus(status) {
        var error = {
            leg: "CLIENT_REQUEST_SEND_OR_RECEIVE",
            code: 110,
            message: "Unexpected HTTP status code: " + status,
            stackTrace: null
        };
        return error;
    }

    function createError_Timeout(e) {
        var error = {
            leg: "CLIENT_REQUEST_SEND_OR_RECEIVE",
            code: 120,
            message: "Timeout",
            stackTrace: (e ? e.toString() : "")
        };
        return error;
    }

    function createError_InvalidURI() {
        var error = {
            leg: "CLIENT_REQUEST_SEND_OR_RECEIVE",
            code: 130,
            message: "You need to provide a valid baseUri",
            stackTrace: null
        };
        return error;
    }

    function createError_CallbackRequired() {
        var error = {
            leg: "CLIENT_REQUEST_SEND_OR_RECEIVE",
            code: 140,
            message: "You must provide a \"callback\" method to receive the response.",
            stackTrace: null
        };
        return error;
    }

    function decomposeURI(tp) {
        var uri = getBaseUri();

        {
            var ix = uri.indexOf("://");
            if (ix < 0) {
                throw "Invalid URI";
            }

            tp.protocol = uri.substring(0, ix);

            var sIx = uri.indexOf("/", ix + "://".length);

            var hostAndPort = uri.substring(ix + "://".length, sIx);
            var pIx = hostAndPort.indexOf(":");
            if (pIx > 0) {
                var host = hostAndPort.substring(0, pIx);
                tp.hostname = host;
                var portString = hostAndPort.substring(pIx + 1);
                var port = parseInt(portString);
                tp.port = port;
            } else {
                tp.hostname = hostAndPort;
            }

        }
    }

    function doXhr(tp, callback, body) {
        try {
            decomposeURI(tp);
        } catch (e) {
            var response = {};

            response.error = createError_InvalidURI();

            if (callback) {
                callback(response);
                return null;
            } else {
                return response;
            }
        }

        var response = null;

        var xhr = new XMLHttpRequest(tp, callback, body);

        //	async if callback present
        xhr.open("POST", tp.uri, callback !== null);
        for (var ix = 0; ix < tp.headers.length; ix++) {
            var h = tp.headers[ix];
            xhr.setRequestHeader(h.key, h.value);
        }

        xhr.onreadystatechange = function () {
            // 0: request not initialized
            // 1: server connection established
            // 2: request received
            // 3: processing request
            // 4: request finished and response is ready

            if (this.readyState == 4) {
                response = {};

                //	200: "OK"
                if (this.status == 200) {
                    try {
                        response = parseMaConnectJsonResponse(this.responseText);
                    } catch (e) {
                        response.error = createError_ParsingResponse(e);
                    }
                } else {
                    response.error = createError_HttpStatus(this.status);
                }

                if (callback !== null) {
                    callback(response);
                }
            }
        };

        //
        xhr.send(body);

        return response;
    }

    function doNode(tp, callback, body) {
        if (typeof callback !== "function") {
            throw "You must provide a \"callback\" method to receive the response.";
        }

        try {
            decomposeURI(tp);
        } catch (e) {
            var response = {};

            response.error = createError_InvalidURI();

            if (callback) {
                callback(response);
                return null;
            } else {
                return response;
            }
        }

        var tehResult = null;

        var headers = {};
        headers["User-Agent"] = "FiixCmmsClient (Node) " + getClientVersion();

        for (var ix = 0; ix < tp.headers.length; ix++) {
            var kv = tp.headers[ix];
            headers[kv["key"]] = kv["value"];
        }

        var options = {
            host: tp.hostname,
            port: tp.port,
            method: "POST",
            headers: headers,
            path: "/api/?" + tp.queryString
        };

        var useSSL = tp.protocol == 'https';
        var http = useSSL ? require('https') : require('http');

        if (useSSL) {
            var https = require('https');
            var nodeSslAgent = new https.Agent({
                rejectUnauthorized: true
            });
            options.agent = nodeSslAgent;
        }

        var result = "";
        var chunkCount = 0;

        var req = http.request(options, function (resp) {
            resp.setEncoding('utf8');

            resp.on('data', function (chunk) {
                result += chunk;
                chunkCount++;
            });

            resp.on('end', function () {
                var response = parseMaConnectJsonResponse(result);

                callback(response);
            });
        });

        if (getTimeoutMs()) {
            req.setTimeout(getTimeoutMs(), function () {
                try {
                    stream.abort()
                } catch (e) {

                }

                var response = {};

                response.error = createError_Timeout(e);

                callback(response);
            });
        }

        req.on('error', function (e) {
            var response = {};

            response.error = createError_ParsingResponse(e);

            callback(response);
        });

        req.write(body);
        req.end();

        return tehResult;
    }

    /**
     */
    function executeRequest(request) {

        var callback = (typeof request[C_CALLBACK] === "function" ? request[C_CALLBACK] : null);
        delete request[C_CALLBACK];

        request["requestId"] = requestId;
        requestId++;

        request["requestSentUnixTime"] = getUtcTime();

        request["clientVersion"] = getClientVersion();

        if (typeof syncRev !== "undefined" && syncRev != null) {
            request["syncRev"] = syncRev;
        }

        var body = JSON.stringify(request);

        var action = request[C_MAGICK_API_OBJECT_JSON_FIELD_NAME];
        var tp = calcTransportParameters(action);

        var tehResult = null;

        if (useNode) {
            tehResult = doNode(tp, callback, body);
        } else
        if (useXhr) {
            tehResult = doXhr(tp, callback, body);
        } else {
            throw "Error: unknown environment - not Node, not browser, what is it?";
        }

        if (callback === null) {
            return tehResult;
        }
    }

    function prepareFindById(params) {
        params[C_MAGICK_API_OBJECT_JSON_FIELD_NAME] = "FindByIdRequest";
        return params;
    }

    function findById(params) {
        var req = prepareFindById(params);

        var ret = executeRequest(req);

        return ret;
    }

    function prepareFind(params) {
        params[C_MAGICK_API_OBJECT_JSON_FIELD_NAME] = "FindRequest";

        return params;
    }

    function find(params) {
        var req = prepareFind(params);

        var ret = executeRequest(req);

        return ret;
    }

    function prepareAdd(params) {
        params[C_MAGICK_API_OBJECT_JSON_FIELD_NAME] = "AddRequest";

        var className = params[C_CLASS_NAME];
        var object = params[C_OBJECT];
        addClassNameParameterToObject(className, object);

        return params;
    }

    function add(params) {
        var req = prepareAdd(params);

        var ret = executeRequest(req);

        return ret;
    }

    function prepareChange(params) {
        params[C_MAGICK_API_OBJECT_JSON_FIELD_NAME] = "ChangeRequest";
        delete params["id"];

        var className = params[C_CLASS_NAME];
        var object = params[C_OBJECT];
        addClassNameParameterToObject(className, object);

        return params;
    }

    function change(params) {
        var req = prepareChange(params);

        var ret = executeRequest(req);

        return ret;
    }

    function prepareRemove(params) {
        params[C_MAGICK_API_OBJECT_JSON_FIELD_NAME] = "RemoveRequest";

        return params;
    }

    function remove(params) {
        var req = prepareRemove(params);

        var ret = executeRequest(req);

        return ret;
    }

    function prepareRpc(params) {
        params[C_MAGICK_API_OBJECT_JSON_FIELD_NAME] = "RpcRequest";

        return params;
    }

    function rpc(params) {
        var req = prepareRpc(params);

        var ret = executeRequest(req);

        return ret;
    }

    function batch(params) {
        params[C_MAGICK_API_OBJECT_JSON_FIELD_NAME] = "BatchRequest";

        var ret = executeRequest(params);

        return ret;
    }

    function getPermissions() {
        var pdret = rpc({
            "name": "GetPermissions",
            "action": "get"
        });
        if (!pdret.response || !pdret.response.object) {
            //	wtf.
            return false;
        } else {
            permissionsDescriptor = pdret.response.object.permissionsDescriptor;
            permissionsDescriptorLastFetchUnixTime = new Date().getTime();
        }
    }

    function hasClassPermission(className, permissionType, siteId) {
        var tableName = "tbl" + className;
        //	See if we need to get the permissions descriptor
        if (!permissionsDescriptor || (new Date().getTime() - permissionsDescriptorLastFetchUnixTime) > PERMISSIONS_REFRESH_PERIOD_MS) {
            getPermissions();
            if (!permissionsDescriptor) {
                return false;
            }
        }

        var pd = permissionsDescriptor;

        //
        var ret = false;

        if (pd.isAdministrator) {
            ret = true;
        } else {
            //	Gotz "2" normalize the resource name
            var resourceName = "marn:cmms:tbl:" + tableName;
            //	Resolve the permission
            var resourceId = pd.resourceIdsByName[resourceName];
            var searchFor = "r" + resourceId + ".grants=";

            var quit = false;
            for (var ix = 0; ix < pd.groupIdsBySiteId.length; ix++) {
                if (quit) {
                    break;
                }

                var elem = pd.groupIdsBySiteId[ix];
                var elemSiteId = elem.siteId;
                if (siteId == null || siteId == elemSiteId) {
                    var elemGroupIds = elem.groupIds;
                    for (var gidx = 0; gidx < elemGroupIds.length; gidx++) {
                        var groupId = elemGroupIds[gidx];
                        var permissions = pd.permissionsByGroupId[groupId];
                        if (permissions) {
                            var six = permissions.indexOf(searchFor);
                            if (six >= 0) {
                                var send = permissions.indexOf("\n", six);
                                if (send > 0) {
                                    var grant = permissions.substring(six + searchFor.length, send);
                                    if (grant) {
                                        var find = grant.indexOf(permissionType);
                                        if (find >= 0) {
                                            ret = true;
                                            quit = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return ret;
    }

    function addClassNameParameterToObjects(className, objects) {
        var object, i;
        for (i = 0; i < objects.length; i++) {
            object = objects[i];
            addClassNameParameterToObject(className, object);
        }
    }

    function addClassNameParameterToObject(className, object) {
        object[C_CLASS_NAME] = className;
    }

    function getBoolean(value, defaultValue) {
        if (typeof value === "boolean") {
            return value;
        } else {
            return defaultValue;
        }
    }

    //	Reveal
    return {
        /**
         * @memberOf FiixCmmsClient
         */
        getClientVersion: getClientVersion,

        setBaseUri: setBaseUri,
        getBaseUri: getBaseUri,

        getTimeoutMs: getTimeoutMs,
        setTimeoutMs: setTimeoutMs,

        setUseXhr: setUseXhr,
        setUseNode: setUseNode,

        setPKey: setPKey,
        setAppKey: setAppKey,
        setSyncRev: setSyncRev,
        setAuthToken: setAuthToken,
        setSignMessages: setSignMessages,
        setMaConnectJsonParseFunction: setMaConnectJsonParseFunction,

        prepareFindById: prepareFindById,
        findById: findById,

        prepareFind: prepareFind,
        find: find,

        prepareAdd: prepareAdd,
        add: add,

        prepareChange: prepareChange,
        change: change,

        prepareRemove: prepareRemove,
        remove: remove,

        prepareRpc: prepareRpc,
        rpc: rpc,

        getSignedRequestParams: calcTransportParameters,

        batch: batch,

        hasClassPermission: hasClassPermission,

        calcFileURI: calcFileURI,
        calcFileUploadURI: calcFileUploadURI,
        calcWOFileURI: calcWOFileURI
    };
};

if (typeof exports === "object") {
    module.exports = FiixCmmsClient;
}
