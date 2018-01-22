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
