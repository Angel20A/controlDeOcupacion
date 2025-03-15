const URL_API = 'https://localhost:3000';
const instance = axios.create({
    baseURL: URL_API,
});

//validar si el token existe en el local storage
async function tokenExistence(){
    if(!localStorage.getItem('token')){
        window.location.href = "login.html"
    };
};
tokenExistence();

//valida el token si aún está vencido
async function tokenValidation(){
    try{
        const token = localStorage.getItem('token');
        //validar el token
        const tokenValidate = await instance.get("/tokenValidation", {
            headers:{
                "Authorization": token
            }
        })
        console.log(tokenValidate.data);
        return tokenValidate.data.data;
    }catch(error){
        window.location.href = "login.html"
    }
    
};
tokenValidation();


async function closeDiv(button){
    document.getElementById(button).click();
}

async function showButtons(button, button2){
    document.getElementById(button).style.display = "block"
    document.getElementById(button2).style.display = "block"
}

async function hideButtons(button, button2){
    document.getElementById(button).style.display = "none"
    document.getElementById(button2).style.display = "none"   
}

async function showHideCheck(hide){
    const check = document.getElementById(hide);

    if(check.style.display === "none"){
        check.style.display = "block";
    }else{
        check.style.display = "none";
    }
}

async function getTokenUser(){
    try{
        const token = await tokenValidation(); //se llama a la función que valida el token para obtener los datos del usuario
        //setear los datos
        const id = token.idUsuario;
        const nombre = token.nombre;
        const usuario = token.usuario;
        const contrasena = token.contrasena;
        //enviar los datos a los elementos html
        document.getElementById("idPatch").value = id;
        document.getElementById("nombrePatch").value = nombre;
        document.getElementById("usuarioPatch").value = usuario;
        //document.getElementById("contrasenaPatch").value = contrasena; //no se envía la contraseña
    }catch(error){
        console.log(error);
    }
}

async function updateUsuario(){
    var span = document.getElementById("spanPatch")
    try{
        span.innerHTML = "";
        const id = document.getElementById("idPatch").value;
        const nombre = document.getElementById("nombrePatch").value;
        const usuario = document.getElementById("usuarioPatch").value;
        const contrasena = document.getElementById("contrasenaPatch").value;
        var json = {};
        if(nombre !== ""){
            json.nombre = nombre;
        }
        if(usuario !== ""){
            json.usuario = usuario;
        }
        if(contrasena !== ""){
            json.contrasena = contrasena;
        }
        console.log(json)

        const res = await instance.patch("/usuario/" + id, json)
        console.log(res.data);
        const token = res.data.token;
        localStorage.setItem('token', token);
        document.getElementById('btnUsuario').click();
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
//updateUsuario();

async function deleteUsuario(){
    var span = document.getElementById("spanPatch");
    var alert = confirm("¿estás seguro de eliminar la cuenta?");
    if(alert == true){
        try{
            console.log("se seleccionó aceptar");
            setTimeout(() => {
                console.log("Waited 3 seconds!");
            }, 3000);
            const token = await tokenValidation(); //se llama a la función que valida el token para obtener los datos del usuario
            //setear el id
            const id = token.idUsuario;
            const res = await instance.delete("/usuario/" + id);
            console.log(res);
            window.location.href = "login.html" //se redirige al login ya que el usuario se eliminó
        }catch(error){
            console.log(error.response.data);
            span.innerHTML += '<p>' + error + '</p>';
        }
    }
}
//deleteUsuario();

async function progressBarData(porcentaje){
    const grados = porcentaje/100 * 180;
    console.log(grados);
    const progress = document.querySelector(".progress-bar");
    
    console.log(progress);
    
    //rotaciones
    progress.style.transform = `rotate(${grados}deg)`; //se rota el transform general
    progress.style.setProperty("--rotateBefore" ,`rotate(-${grados}deg)`); //se rota el transform del before utilizando la variable --rotateBefore
    
    progress.style.setProperty("--rotateAfter" ,`rotate(-${grados}deg)`); ////se rota el transform del after utilizando la variable --after

    progress.style.setProperty("--porcentaje", `"${porcentaje}%"`);
    document.getElementById("progress-text").style.setProperty("--text", `-"${porcentaje}%"`);
}

progressBarData(100);