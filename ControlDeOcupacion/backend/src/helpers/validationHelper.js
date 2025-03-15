import { validationResult } from "express-validator";

export const validateResult = (req, res, next) =>{
    try{
        //validar si hay errores en la request
        validationResult(req).throw(); //si hay errores, se envía una excepción
        return next(); //si no hay errores, se envia al siguiente middleware
    }catch(error){
        res.status(400);
        res.send({ errors: error.array() });
    }
}