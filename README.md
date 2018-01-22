# node-request-proxy
NodeJS proxy server for sending requests

Supports:
- HTTP/HTTPS Get requests with url query.

# Usage

```js
import { ProxyInstance } from "./instance";

const port = 3002;
let serverInstance = new ProxyInstance(port)
.addListener("error", (err) => {
    console.error("proxy server error:", err);
})
.addListener("close", () => {
    console.log("proxy server closed");
});

console.log("proxy server started on port " + serverInstance.port);

serverInstance.Get("https://eun1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Furek?api_key=RGAPI-c2dedd48-8327-4afc-83d5-5f052f78a7f9", (err, response) => {
    if (err != null) console.error(err);
    else console.dir(response, {colors: true});

    serverInstance.Close();
});

```
