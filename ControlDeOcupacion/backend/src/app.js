import express from "express"
import userRoutes from "./routes/user.routes.js"
import cors from "cors"

const app = express();

//recibir objetos json
app.use(express.json());
//cors para que se pueda acceder desde cualquier lugar
app.use(cors()); //va antes de userRoutes para que funcione
app.use(userRoutes);

export default app;