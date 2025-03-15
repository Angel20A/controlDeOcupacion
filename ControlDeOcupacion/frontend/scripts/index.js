//const { get } = require("express/lib/request");

const API_URL = 'https://localhost:3000';
const instance = axios.create({
    baseURL: API_URL,
});
localStorage.clear();

function showDiv(idShow, idHide){
    document.getElementById(idShow).style.display = "block";
    document.getElementById(idHide).style.display = "none";

    document.getElementById("usuarioLogin").value = ""
    document.getElementById("contrasenaLogin").value = ""
    document.getElementById("spanLogin").innerHTML = ""

    document.getElementById("nombreSignup").value = ""
    document.getElementById("usuarioSignup").value = ""
    document.getElementById("contrasenaSignup").value = ""
    document.getElementById("spanSignup").innerHTML = ""
};

async function loginUsuario(user, pass){
    var span = document.getElementById("spanLogin")
    try{
        span.innerHTML = ""
        const usuario = document.getElementById(user).value;
        const contrasena = document.getElementById(pass).value;
        console.log(usuario, " ", contrasena);

        const res = await instance.post("/loginUsuario",{
            usuario: usuario, //"angelf@gmail.com"
            contrasena: contrasena //"aragon123"
        });
        console.log(res);
    
        const token = res.data.token; //obtener el token
        //validar el token
        const tokenValidation = await instance.get("/tokenValidation", {
            headers:{
                "Authorization": token
            }
        })
        console.log(tokenValidation.data);

        localStorage.setItem('token', token);
        //axios.get("home.html", config); // redireccionar a home.html
        window.location.href = 'home.html';
        //window.location.headers = headers;
    }catch(err){
        if(err.response.data.errors){ //|| err.response.status === 400
            const errors = err.response.data.errors
            console.log(errors);

            for(i=0; i<errors.length; i++){
                console.log(errors[i].msg);
                //span.appendChild(errors[i].msg);
                span.innerHTML += '<p>' + errors[i].msg + '.</p>';
            }
        }
        if(err.response.data.message){
            const error = err.response.data.message
            console.log(error);
            span.innerHTML += '<p>' + error + '</p>';
        }
        console.log(err);
    }
}
//loginUsuario();

async function registerUsuario(name, user, pass){
    var span = document.getElementById("spanSignup")
    try{
        span.innerHTML = ""
        const nombre = document.getElementById(name).value;
        const usuario = document.getElementById(user).value;
        const contrasena = document.getElementById(pass).value;
        console.log(nombre , " ", usuario, " ", contrasena);

        const res = await instance.post("/usuario", {
            nombre: nombre, //"Carlos Carrera"
            usuario: usuario, //"ccarrera@gmail.com"
            contrasena: contrasena//"charlie123"
        })
        console.log(res);

        const token = res.data.token; //obtener el token
        //validar el token
        const tokenValidation = await instance.get("/tokenValidation", {
            headers:{
                "Authorization": token
            }
        })
        console.log(tokenValidation.data);
        localStorage.setItem('token', token);
        window.location.href = 'home.html';
    }catch(err){
        if(err.response.data.errors){ //|| err.response.status === 400
            const errors = err.response.data.errors
            //console.log(errors);

            for(i=0; i<errors.length; i++){
                console.log(errors[i].msg);
                //span.appendChild(errors[i].msg);
                span.innerHTML += '<p>' + errors[i].msg + '.</p>';
            }
        }
        if(err.response.data.message){
            const error = err.response.data.message
            console.log(error);
            span.innerHTML += '<p>' + error + '</p>';
        }
    }
}

//registerUsuario();