import * as http from "http";
import * as https from "https";
import * as URL from "url";
import { EventEmitter } from "events";

class ProxyInstance extends EventEmitter {
    server: http.Server;
    port: number;

    constructor(port: number) {
        super();
        
        this.server = http.createServer();
        this.server.on("error", (err) => {
            this.emit("error", err);
        });
        this.server.on("close", () => {
            this.emit("close");
        })
        this.server.listen(port);
        this.port = port;
    }

    Close(callback: () => void = null) {
        this.server.close(() => {
            if (callback != null) callback();
            return;
        });
    }

    Get(url: string, callback: (err: Error, response: JSON | string) => void) {
        // Analyze url
        let parsedUrl = URL.parse(url);

        // Send GET request
        if (parsedUrl.protocol.toLowerCase() == "http:") {
            this.GetHTTP(parsedUrl, (err, response) => {
                return callback(err, response);
            });
        } else if (parsedUrl.protocol.toLowerCase() == "https:") {
            this.GetHTTPS(parsedUrl, (err, response) => {
                return callback(err, response);
            });
        } else {
            return callback(new Error("unknown protocol: " + parsedUrl.protocol), null);
        }
    }

    GetHTTP(parsedUrl: URL.UrlWithStringQuery, callback: (err: Error, response: JSON | string) => void) {
        http.get({
            host: parsedUrl.hostname,
            port: parsedUrl.port ? parsedUrl.port : 80,
            path: parsedUrl.path
        }, (res) => {
            let result = "";

            res.on("data", (chunk) => {
                result += chunk;
            });
            res.on("end", () => {
                let parsedResult: JSON = null;

                try {
                    parsedResult = JSON.parse(result);
                } catch (e) {
                    // Return as string
                    return callback(null, result);
                }

                return callback(null, parsedResult);
            });
            res.on("error", (err) => {
                return callback(err, null);
            });
        })
        .on("error", (err) => {
            return callback(err, null);
        });
    }

    GetHTTPS(parsedUrl: URL.UrlWithStringQuery, callback: (err: Error, response: JSON | string) => void) {
        https.get({
            hostname: parsedUrl.hostname,
            port: parsedUrl.port ? parsedUrl.port : 443,
            path: parsedUrl.path
        }, (res) => {
            let result = "";

            res.on("data", (chunk) => {
                result += chunk;
            });
            res.on("end", () => {
                let parsedResult: JSON = null;

                try {
                    parsedResult = JSON.parse(result);
                } catch (e) {
                    // Return as string
                    return callback(null, result);
                }

                return callback(null, parsedResult);
            });
            res.on("error", (err) => {
                return callback(err, null);
            });
        })
        .on("error", (err) => {
            return callback(err, null);
        });
    }
}

export { ProxyInstance };