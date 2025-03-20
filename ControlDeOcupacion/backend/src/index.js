import app from "./app.js"
import { PORT } from "./config.js"
import fs from "fs"
import https from "https"
import { WebSocketServer } from "ws"

/*https.createServer(app).listen(8080);
https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app).listen(PORT);*/



//app.set("port", PORT);

var server = https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app);//.listen(PORT);


//Creación del servidor de sockets e incorporación al servidor de la aplicación
const wss = new WebSocketServer({server: server});

wss.on("connection", (ws) => {
    console.log("Nuevo cliente conectado!");

    //enviar mensaje de bienvenida
    ws.send("Hola este es un mensaje de bienvenida");
});

server.listen(PORT, ()=>{
    console.log("Server corriendo en puerto: " + PORT);
})