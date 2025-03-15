import { loginUsuario } from "/index.js";
//const index = require("/index.js")

export function showDiv(idShow, idHide){
    document.getElementById(idShow).style.display = "block";
    document.getElementById(idHide).style.display = "none";
};

function login(usuario, contrasena){
    const user = document.getElementById(usuario).value;
    const pass = document.getElementById(contrasena).value;
    console.log(user, ' ', pass );
    //index.loginUsuario(user, pass);
}
