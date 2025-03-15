import sql from "mssql";

const dbSettings ={
    server: "localhost", //DESKTOP-NLFFR9J\\SQL2022
    database : "controlOcupacion",
    user: "sa",
    password: "angel20",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
}

export const getConnection = async () =>{
    try{
        const pool = await sql.connect(dbSettings);
        return pool; //retornar la conexión para ser usado
    }catch(error){
        console.log(error);
    }
}