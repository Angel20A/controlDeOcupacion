import app from "./app.js"
import { PORT } from "./config.js"
import fs from "fs"
import https from "https"
import { WebSocketServer } from "ws"
import { getDevices } from "./controllers/devices.controller.js"
import devicesRoutes from "./routes/devices.routes.js"

/*https.createServer(app).listen(8080);
https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app).listen(PORT);*/


var server = https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app);//.listen(PORT);
//server;

//Creación del servidor de sockets e incorporación al servidor de la aplicación
/*const wss = new WebSocketServer({server: server});

wss.on("connection", (ws) => {
    console.log("Nuevo cliente conectado!");
    
    //const devices = app.use('/devices', getDevices);
    //const devices = app.use(devicesRoutes);
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
            //ws.send(JSON.parse(devices));
            //console.log(JSON.parse(devices));
            ws.send(JSON.stringify(devices));
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
})*/



const wss = new WebSocketServer({server: server, path:'/devices'});
let devices = [{id: "55442211" ,name: "XP2 Main Exit Device (192.168.0.25)"},{id: "55441122",name: "XS2 Main Entrance Device (192.168.0.35)"}]
let base = {data:{Event: {device_id: null }}}


let Send2Client = (opc) => {
    base.data.Event.device_id = devices[opc-1];
    if(wss){ 
        wss.clients.forEach((client, req) => {
            console.log("Sent to: ", req._socket._peername);
            if (client.readyState === WSserver.OPEN) {
              client.send(JSON.stringify(base));
            }
        });
    }    
}

let wsServer = () => {
    wss.on('connection', (ws, req) => {
        console.log("New Connection from: ", req.socket.remoteAddress+ ":"+ req.socket.remotePort);
        ws.on('close', (code, reason)=>{
            console.log("Client: " + req.socket.remoteAddress + ":" + req.socket.remotePort + ", with code: "+ code + " and reason: " + reason);
        });
        ws.on('error', (err)=>{
            console.log("Error happenned with Client: " + req.socket.remoteAddress + ":" + req.socket.remotePort + ", error description: " + err );
        });
        // ws.send(data);
    });
}

const stdin = process.openStdin();
stdin.addListener("data", function(d) {
    let opc = parseInt(d.toString().trim());
    console.log(`Option Chosen : [ ${opc} ]`);
    switch(opc){
        case 1:
            Send2Client(opc);
            break;
        case 2:
            Send2Client(opc);
            break;
        default:
            console.error("Not an Option");
    }
    console.log("Devices Menu:\n1. ID: 55442211\n2. ID: 55441122\nType the option number + ENTER");
});

server.listen(PORT, ()=> {
    console.log(`Server running on port: ${PORT}`);
    console.log("Devices Menu:\n1. ID: 55442211\n2. ID: 55441122\nType the option number + ENTER");
    wsServer();
});