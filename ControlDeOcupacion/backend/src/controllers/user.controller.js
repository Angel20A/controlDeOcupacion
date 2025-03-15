import { getConnection } from "../database/connection.js";
import sql from "mssql";
import { generateToken } from "../token.js";
import { encrypt, compare } from "../helpers/encrypt.Helper.js";


export const loginUsuario = async(req, res) => {
    const pool = await getConnection();
    const { usuario, contrasena } = req.body;
    //buscar el usuario en la base de datos
    const result = await pool.request()
        .input("user", sql.VarChar, usuario)
        .query("select*from usuario where usuario=@user")

    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Usuario no encontrado."}); //Usuario o contraseña incorrectos.
    }

    const checkPassword = await compare(contrasena, result.recordset[0].contrasena); //se compara la contrasena ingresada con la contraseña encriptada de la base de datos
    if(!checkPassword){
        return res.status(404).json({message: "Contraseña incorrecta."})
    }

    const login = result.recordset[0]; //obtiene el primer registro del resultset
    req.body = result.recordset[0]; //se asigna el registro al body del request
    const token = generateToken({ login });

    return res.json({ login, token });
}

export const logoutUsuario = async(req, res) => {
    res.json({message: "Sesión cerrada."});
}

export const tokenValidation = async (req, res) =>{ //el req.body ya contiene los datos del usuario, proviene del middleware validateToken
    const { idUsuario, nombre, usuario } = req.body; //se obtienen los datos del usuario del body del request
    //console.log(req.body);
    const data = {idUsuario, nombre, usuario};
    return res.json({message: "Datos obtenidos correctamente.", data});
}

export const getUsuario = async(req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query("select*from usuario");
    res.json(result.recordset)
};

export const getUsuarioId = async(req, res) => {
    const pool = await getConnection();
    const id = req.params.id;
    console.log(id);
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("select*from usuario where idUsuario=@id");
    
    //validar si no se encontró el usuario
    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Usuario no encontrado"});
    }

    return res.json(result.recordset[0]);
};

export const createUsuario = async(req, res) => {
    try{
        const pool = await getConnection();
        const { nombre, usuario, contrasena } = req.body;

        //validar si el usuario ya existe
        const exisenciaUsuario = await pool.request()
            .input("user", sql.VarChar, usuario)
        .query("exec sp_existenciaUsuario @usuario = @user");

        if(exisenciaUsuario.rowsAffected[0] > 0){ //si el usuario ya existe
            return res.status(400).json({message: "El usuario ya existe."});
        }

        const passwordHash = await encrypt(contrasena); //encripta la contraseña
        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('usuario', sql.VarChar, usuario)
            .input('contrasena', sql.VarChar, passwordHash) //se envía la contraseña encriptada
        .query(
            "insert into usuario(nombre, usuario, contrasena) values(@nombre, @usuario, @contrasena); " +
            "select top 1 * from usuario order by idUsuario desc;" //"SCOPE_IDENTITY() as id;      select scope_identity() as id" devuelve el id del registro insertado
        );

        const login = result.recordset[0]; //obtiene el primer registro del resultset
        console.log(login); //se imprime el registro obtenido
        const token = generateToken({ login });
        res.json({login, token});
    }catch(e){
        return res.status(404).json({ error: e.message});
    }
};

export const updateUsuario = async(req, res) => {
    try{
        const pool = await getConnection();
        const { id } = req.params;
        console.log(id)
        const { nombre, usuario, contrasena } = req.body; 
        console.log(nombre)
        console.log(usuario)
        console.log(contrasena)
        const passwordHash = await encrypt(contrasena); //encripta la contraseña
        console.log(passwordHash)
        var query;
        if (nombre && usuario && passwordHash) { //si se envían los tres campos
            query = "update usuario set nombre=@nombre, usuario=@usuario, contrasena=@contrasena where idUsuario=@id;" +
                "select*from usuario where idUsuario=@id;";
        }else if(nombre && usuario && !passwordHash){ //si se envían nombre y usuario
            query = "update usuario set nombre=@nombre, usuario=@usuario where idUsuario=@id;" +
                "select*from usuario where idUsuario=@id;";
        }else if(nombre && !usuario && passwordHash){ //si se envían nombre y contraseña
            query = "update usuario set nombre=@nombre, contrasena=@contrasena where idUsuario=@id;" +
                "select*from usuario where idUsuario=@id;";
        }else if(!nombre && usuario && passwordHash){ //si se envían usuario y contraseña
            query = "update usuario set usuario=@usuario, contrasena=@contrasena where idUsuario=@id;" +
                "select*from usuario where idUsuario=@id;";    
        }else if(nombre && !usuario && !passwordHash){ //si se envía nombre
            query = "update usuario set nombre=@nombre where idUsuario=@id;" +
            "select*from usuario where idUsuario=@id;";
        }else if(!nombre && usuario && !passwordHash){ //si se envía usuario
            query = "update usuario set usuario=@usuario where idUsuario=@id;" +
            "select*from usuario where idUsuario=@id;";
        }else if(!nombre && !usuario && passwordHash){ //si se envía contraseña
            query = "update usuario set contrasena=@contrasena where idUsuario=@id;"
            + "select*from usuario where idUsuario=@id;";
        }
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("nombre", sql.VarChar, nombre)
            .input("usuario", sql.VarChar, usuario)
            .input("contrasena", sql.VarChar, passwordHash)
            .query(
                query
            )
        
        console.log(result);
        if(result.rowsAffected[0] === 0){
            return res.status(404).json({mensaje: "Usuario no encontrado."})
        }
        
        const login = result.recordset[0]; //obtiene el primer registro del resultset
        console.log(login) //se imprime el registro obtenido
        const token = generateToken({ login });
        res.json({login, token});
    }catch(e){
        return res.status(404).json({ error: e.message});
    }
};

export const deleteUsuario = async(req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
            .input("id", sql.Int, req.params.id)
        .query("delete from usuario where idUsuario=@id");
    
    console.log(result);
    //validar si no se eliminó el usuario por medio de rowsAffected
    if(result.rowsAffected[0] == 0){
        return res.status(400).json({message: "Usuario no encontrado."});
    }
    return res.json({message: "Usuario eliminado correctamente."});
};