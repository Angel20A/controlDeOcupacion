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
//tokenExistence();

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
//tokenValidation();


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
    if(porcentaje <= 100){
        const grados = porcentaje/100 * 180;
        console.log(grados);
        const progress = document.querySelector(".progress");
        progress.style.setProperty("--grados", `rotate(${grados}deg)`);
    }else{
        console.log("Porcentaje debe ser menor a 100");
    }
}
//progressBarData(90);

async function progressBar(contador, limInferior, limSuperior){
    const cont = parseInt(document.getElementById(contador).value);
    const inferior = parseInt(document.getElementById(limInferior).value);
    const superior = parseInt(document.getElementById(limSuperior).value);
    console.log(cont);
    console.log(inferior);
    console.log(superior);

    const h3Inferior = document.getElementById('limInferior');
    const h3Superior = document.getElementById('limSuperior');
    const h2Cantidad = document.getElementById('cantidad');
    const span = document.getElementById('spanConfig');
    span.innerHTML = "";
    var porcentaje;

    /*CASOS:
    1. Si el valor de la cantidad está vacío y es menor a 0.    
    2. Si el valor de la cantidad es menor al inferior.
    3. Si el valor de la cantidad es mayor al superior.

    4. Si el valor de el límite inferior está vacio o es menor a cero.
    5. Si el límite inferior es mayor al límite superior.
    
    6. Si el límite superior está vacio o es menor a cero.
    */
    if((inferior > 0 || inferior != NaN) && (superior > 0  || superior != NaN) && (superior > inferior)){
        console.log("if 1");
        console.log(superior + ">" + inferior);
        h3Inferior.innerHTML = inferior;
        h3Superior.innerHTML = superior;
        porcentaje = Math.round((inferior * 100) / superior);
        progressBarData(porcentaje);
    
        if(cont == NaN || cont == 0){
            h2Cantidad.innerHTML = "0";
        }
    }else{
        span.innerHTML = "limite inferior y/o superior deben ser positivos. O superior no debe ser 0.";
        console.log("limite inferior y/o superior deben ser positivos. O superior no debe ser 0.");
    } 

    if((cont > 0) && (cont !== NaN)){ //&& (superior > 0 || superior != "")
        console.log("if 2");
        if((cont > inferior) && (cont <= superior)){
            if(inferior <= 0 || inferior == NaN){
                h3Inferior.innerHTML = "0";
            }else{
                h3Inferior.innerHTML = inferior;
            }
            h3Superior.innerHTML = superior;
            h2Cantidad.innerHTML = cont;
            porcentaje = Math.round((cont * 100) / superior);
            progressBarData(porcentaje);
        }else{
            span.innerHTML = "La cantidad debe estar entre el límite inferior y el límite superior.";
            console.log("la cuenta manual no puede ser menor al límite inferior y mayor al límite superior.");
        }
    }else{
        h2Cantidad.innerHTML = "0";
    }
}

async function resetearCuenta(checkbox){
    const check = document.getElementById(checkbox).checked;
    console.log(check);

    const h3Inferior = document.getElementById('limInferior');
    const h3Superior = document.getElementById('limSuperior');
    const h2Cantidad = document.getElementById('cantidad');
    const span = document.getElementById('spanConfig');
    const cont = document.getElementById('cuentaManual');
    const inferior = document.getElementById('limiteInferior');
    const superior = document.getElementById('limiteSuperior');

    if(check){
        console.log('está seleccionado');
        cont.value = "";
        inferior.value = "";
        superior.value = "";
        
        h2Cantidad.innerHTML = "";
        h3Inferior.innerHTML = 0;
        h3Superior.innerHTML = 0;
        span.innerHTML = "";
        progressBarData(0);

    }else if(check == false){
        console.log('no está seleccionado.');
    }
}