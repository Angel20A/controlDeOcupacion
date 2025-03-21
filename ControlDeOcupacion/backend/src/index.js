import app from "./app.js"
import { PORT } from "./config.js"
import fs from "fs"
import https from "https"
import { WebSocketServer } from "ws"
import { getDevices } from "./controllers/devices.controller.js"

/*https.createServer(app).listen(8080);
https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app).listen(PORT);*/



var server = https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app);//.listen(PORT);
server;

//Creación del servidor de sockets e incorporación al servidor de la aplicación
const wss = new WebSocketServer({server: server});

wss.on("connection", (ws) => {
    console.log("Nuevo cliente conectado!");
    
    //const devices = app.get('/devices', getDevices);
    const devices = getDevices();

    //enviar mensaje de bienvenida
    ws.send("Hola este es un mensaje de bienvenida");
    //ws.send(JSON.stringify(getDevices()));

    //responder
    ws.on("message", (message) =>{
        console.log(message);

        //validación de mensajes
        if(message == "hola"){
            ws.send("Hola!!");
            ws.send(getDevices);
            console.log(devices);
        }else if(message == "adios"){
            ws.send("Adios!!");
        }else{
            ws.send("otro mensaje")
        }
        
    });
});

server.listen(PORT, ()=>{
    console.log("Server corriendo en puerto: " + PORT);
})