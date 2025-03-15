import app from "./app.js"
import { PORT } from "./config.js"
import fs from "fs"
import https from "https"

https.createServer(app).listen(8080);
https.createServer({
    cert: fs.readFileSync('./cert/server.cer'),
    key: fs.readFileSync('./cert/server.key'),
}, app).listen(PORT);

