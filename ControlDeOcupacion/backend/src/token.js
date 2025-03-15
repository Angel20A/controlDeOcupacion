import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "./config.js";

export const generateToken = (user) => 
    jwt.sign(user, SECRET_JWT_KEY, {expiresIn: '1 h'}); 


export const validateToken = (req, res, next) => {
    try{
        req.body = {}; //vacía el body del request
        const accessToken = req.header("Authorization"); //obtiene el token del header del request
        if(!accessToken){
            return res.status(401).json({ message: "Acceso denegado"});
        }

        const token = jwt.verify(accessToken, SECRET_JWT_KEY);
        if(!token){
            return res.status(401).json({ message: "Acceso denegado, token expirado o incorrecto."});
        }else{
            req.body.idUsuario = token.login.idUsuario.toString();
            req.body.nombre = token.login.nombre;
            req.body.usuario = token.login.usuario;
            next(); //continua con la siguiente operación ya que este es un middleware
        }
    }catch(error){
        return res.status(401).json({ message: "Acceso denegado, token expirado o incorrecto.", error: error});
    }
}

export const destroyToken = (req, res, next) => {
    
    
    /*res.clearCookie("accessToken");
    res.json({ message: "Sesión cerrada."});
    
    const accessToken = req.header("Authorization");
    if(!accessToken){
        return res.status(401).json({ message: "Acceso denegado"});
    }
    
    const tokenExpired = jwt.rev
    if(!tokenExpired){
        return res.status(401).json({ message: "No se pudo cerrar la sesión."});
    }
    next();*/
}