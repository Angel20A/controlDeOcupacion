import { json } from "express";
import { getConnection } from "../database/connection.js";
import sql from "mssql";

export const getDevices = async (req, res) => {
    try{
        const pool = await getConnection();
        const result = await pool.request().query("select * from devices;");
        //console.log(result.recordset);

        return res.json(result.recordset);
        //const devices = JSON.stringify(result.recordset);
        //return result.recordsets;
    }catch(e){
        return res.status(404).json({error: e.message});
        //return {error: e.message};
    }
}

export const getDevicesId = async (req, res) => {
    try{
        const pool = await getConnection();
        const id = req.params.id;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("select * from devices where id=@id;");

        //validar si no se encontró el usuario
        if(result.rowsAffected[0] === 0){
            return res.status(404).json({message: "Usuario no encontrado"});
        }

        return res.json(result.recordset[0]);
    }catch(e){
        return res.status(404).json({error: e.message});
    }
}