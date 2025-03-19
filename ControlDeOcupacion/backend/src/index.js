import app from "./app.js"
import { PORT } from "./config.js"
import fs from "fs"
import https from "https"
import WebSocket from "ws"

/*https.createServer(app).listen(8080);
https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app).listen(PORT);*/
const server = https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app).listen(PORT);

const wss = new WebSocket.Server({server: server});

wss.on("connection", function connection(conexion){
})
