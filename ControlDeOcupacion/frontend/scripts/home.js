const URL_API = 'https://localhost:3000';
const instance = axios.create({
    baseURL: URL_API,
});

const ws = new WebSocket("wss://localhost:3000/devices");
ws.addEventListener("open", ()=>{
    console.log("estamos conectados!");
});
ws.addEventListener("message", (message) => {
    //console.log(JSON.parse(message.data));
    const device = JSON.parse(message.data);
    console.log(device.data.Event.device_id);
    progressBarWS(device.data.Event.device_id);
})

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
    //console.log(check);

    if(check.style.display === "none"){
        check.style.display = "block";
    }else{
        check.style.display = "none";
    }
}

/*async function setCheckedButtons(check){
    const button = document.getElementById(check);
    console.log(button.id);
    console.log(button.checked);

    //si el botón se selecciona
    if(button.checked == true){
        if(button.id == "entradaEntradaCheck" || button.id == "salidaEntradaCheck"){
            localStorage.setItem("EntranceDevice", button.id);    
        }else if(button.id == "entradaSalidaCheck" || button.id == "salidaSalidaCheck"){
            localStorage.setItem("ExitDevice", button.id);
        }
    }else if(button.checked == false){ //si el botón se deselecciona
        if(button.id == "entradaEntradaCheck" || button.id == "salidaEntradaCheck"){
            localStorage.setItem("EntranceDevice", "");    
        }else if(button.id == "entradaSalidaCheck" || button.id == "salidaSalidaCheck"){
            localStorage.setItem("ExitDevice", "");
        }
    }
}*/

async function setCheckedButtons(check){
    const button = document.getElementById(check);
    console.log(button);
    const id = button.id.split("-");

    //si el botón se selecciona
    if(button.checked == true){
        console.log(button.id + " botón está seleccionado.");
        if(button.id == (id[0] + "-EntradaCheckEntrada") || button.id == (id[0] + "-SalidaCheckEntrada")){
            localStorage.setItem("EntranceDevice", button.id);
        }else if(button.id == (id[0] + "-EntradaCheckSalida") || button.id == (id[0] + "-SalidaCheckSalida")){
            localStorage.setItem("ExitDevice", button.id);
        }
    }else if(button.checked == false){
        console.log(button.id + " botón no está seleccionado.");
        if(button.id == (id[0] + "-EntradaCheckEntrada") || button.id == (id[0] + "-SalidaCheckEntrada")){
            localStorage.setItem("EntranceDevice", "");
        }else if(button.id == (id[0] + "-EntradaCheckSalida") || button.id == (id[0] + "-SalidaCheckSalida")){
            localStorage.setItem("ExitDevice", "");
        }
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

async function progressBarWS(data){
    const deviceEntrada = localStorage.getItem("EntranceDevice");
    const deviceSalida = localStorage.getItem("ExitDevice");
    console.log(deviceEntrada);
    console.log(deviceSalida);

    if(deviceEntrada !== "" && deviceSalida !== ""){
        const elementEntrada = document.getElementById(deviceEntrada);
        const elementSalida = document.getElementById(deviceSalida);

        const idElementEntrada = elementEntrada.id.split("-");
        const idElementSalida = elementSalida.id.split("-");

        const cantidad = document.getElementById('cantidad');
        const limiteInferior = document.getElementById('limInferior').textContent;
        const limiteSuperior = document.getElementById('limSuperior').textContent;
        if(limiteSuperior !== 0){
            console.log("Limite Superior:" + limiteSuperior);
            //entrada = -EntradaCheckEntrada, -EntradaCheckSalida
            //salida = -SalidaCheckEntrada, -SalidaCheckSalida
            console.log(data.id);
            console.log(idElementEntrada[0]);
            console.log(idElementSalida[0]);
            //console.log(idElementEntrada[0]);
            
            if((data.id + ("-EntradaCheckEntrada")) == elementEntrada.id || (data.id + ("-EntradaCheckSalida")) == elementSalida.id){
                cantidad.textContent = parseInt(cantidad.textContent) + 1;
                console.log(cantidad.textContent);

            }else if((data.id + ("-SalidaCheckEntrada")) == elementEntrada.id || (data.id + ("-SalidaCheckSalida")) == elementSalida.id){
                
                cantidad.textContent = parseInt(cantidad.textContent) - 1;
                console.log(cantidad.textContent);

            }

            const porcentaje = Math.round((cantidad.textContent * 100) / limiteSuperior);
            progressBarData(porcentaje);
            //si el id del dispositivo es igual al id del dispositivo de entrada
            /*if(data.id == idElementEntrada[0]){
            }else if(data.id == idElementSalida[0]){ //si el id del dispositivo es igual al id del dispositivo de salida
            }*/
        }
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

/*async function getDevices(entradaEntrada, entradaSalida, salidaEntrada, salidaSalida){
    try{
        const res = await instance.get("/devices");
        console.log(res.data);
        const deviceMain = res.data[0];
        const deviceExit = res.data[1];
        console.log(deviceMain);
        console.log(deviceExit);

        const elementEntradaEntrada = document.getElementById(entradaEntrada);
        elementEntradaEntrada.innerText = deviceMain.nombre;
        document.getElementById("entradaEntradaCheck").value = deviceMain.id;

        const elementEntradaSalida = document.getElementById(entradaSalida);
        elementEntradaSalida.innerText = deviceExit.nombre;
        document.getElementById("entradaSalidaCheck").value = deviceExit.id;

        const elementSalidaEntrada = document.getElementById(salidaEntrada);
        elementSalidaEntrada.innerText = deviceMain.nombre;
        document.getElementById("salidaEntradaCheck").value = deviceMain.id;

        const elementSalidaSalida = document.getElementById(salidaSalida);
        elementSalidaSalida.innerText = deviceExit.nombre;
        document.getElementById("salidaSalidaCheck").value = deviceExit.id;
        
    }catch(error){
        console.log(error);
        //span.innerHTML += '<p>' + error + '</p>';
    }
}*/

async function getDevices(){
    try{
        const res = await instance.get("/devices");
        console.log(res.data);
        //const deviceMain = res.data[0];
        //const deviceExit = res.data[1];

        const cardEntrada = document.getElementById("cardEntrada");
        const cardSalida = document.getElementById("cardSalida");

        var count = 0;
        res.data.forEach(element => {
            console.log(element);
            var tipoDevice;
            if(count == 0){
                tipoDevice = "Salida";
            }else{
                tipoDevice = "Entrada";
            }
            console.log(tipoDevice);

            //creación de divs padres para insertar los ckeckbox
            const divEntrada = document.createElement("div");
                divEntrada.classList.add("form-check");
                divEntrada.style.display = "block";
                divEntrada.id = element.id + "-Entrada" + tipoDevice;

            const divSalida = document.createElement("div");
                divSalida.classList.add("form-check");
                divSalida.style.display = "block";
                divSalida.id = element.id + "-Salida" + tipoDevice;

            //creación de los checkbox
            const elementEntrada = document.createElement("input");
                elementEntrada.classList.add("form-check-input");
                elementEntrada.type = "checkbox";
                elementEntrada.id = element.id + "-EntradaCheck" + tipoDevice;

            const elementSalida = document.createElement("input");
                elementSalida.classList.add("form-check-input");
                elementSalida.type = "checkbox";
                elementSalida.id = element.id + "-SalidaCheck" + tipoDevice;

            //agregar evento change a los checkbox
            elementEntrada.addEventListener("change", function(){
                setCheckedButtons(element.id + "-EntradaCheck" + tipoDevice); 
                showHideCheck(element.id + "-Salida" + tipoDevice);
            });
            elementSalida.addEventListener("change", function(){
                setCheckedButtons(element.id + "-SalidaCheck" + tipoDevice); 
                showHideCheck(element.id + "-Entrada" + tipoDevice);
            });

            //creación de los labels que pertenecen a cada checkbox
            const labelEntrada = document.createElement("label");
                labelEntrada.classList.add("form-check-label");
                labelEntrada.setAttribute("for", (element.id + "-EntradaCheck" + tipoDevice));
                labelEntrada.id = element.id + "-EntradaLabel";
                labelEntrada.innerHTML = element.nombre;

            const labelSalida = document.createElement("label")
                labelSalida.classList.add("form-check-label");
                labelSalida.setAttribute("for", (element.id + "-SalidaCheck" + tipoDevice));
                labelSalida.id = element.id + "-SalidaLabel";
                labelSalida.innerHTML = element.nombre;

            //agregar los checkbox y labels a los divs
            divEntrada.appendChild(elementEntrada);
            divEntrada.appendChild(labelEntrada);

            divSalida.appendChild(elementSalida);
            divSalida.appendChild(labelSalida);

            //agregar los divs a las cards
            cardEntrada.appendChild(divEntrada);
            cardSalida.appendChild(divSalida);

            console.log(cardEntrada);
            console.log(cardSalida);

            count ++;
        });


        //setear los devices seleccionados por si la página se recarga
        const entranceDevice = localStorage.getItem("EntranceDevice");
        console.log(entranceDevice);
        const buttonEntrance = document.getElementById(entranceDevice);
        console.log(buttonEntrance);
        if(buttonEntrance !== null){
            buttonEntrance.click();
        }

        const exitDevice = localStorage.getItem("ExitDevice");
        console.log(exitDevice);
        const buttonExit = document.getElementById(exitDevice);
        if(buttonExit !== null){
            buttonExit.click();
        }
    }catch(error){
        console.log(error);
    }
}
getDevices();


async function getDevicesId(){
    try{
        const res = await instance.get("/devices/" + id)
        console.log(res.data);
    }catch(error){
        console.log(error.response.data);
        //span.innerHTML += '<p>' + error + '</p>';
    }
}