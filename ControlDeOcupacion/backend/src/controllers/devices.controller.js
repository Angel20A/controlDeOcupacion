import { getConnection } from "../database/connection.js";
//import sql from "mssql";

export const getDevices = async (req, res) => {
    try{
        const pool = await getConnection();
        const result = await pool.request().query("select * from devices;");
        console.log(result.recordset);
        return res.json(result.recordset);
    }catch(e){
        return res.status(404).json({error: e.message});
    }
}