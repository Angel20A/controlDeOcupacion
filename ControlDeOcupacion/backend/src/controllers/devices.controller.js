import { json } from "express";
import { getConnection } from "../database/connection.js";

export const getDevices = async (req, res) => {
    try{
        const pool = await getConnection();
        const result = await pool.request().query("select * from devices;");
        console.log(JSON.parse(result.recordsets));

        //return res.json(result.recordset);
        const devices = JSON.stringify(result.recordset);
        return result.recordset;
    }catch(e){
        //return res.status(404).json({error: e.message});
        return {error: e.message};
    }
}

