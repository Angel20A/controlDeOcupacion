import bcryptjs from 'bcryptjs';

//encriptación de los datos
export const encrypt = async(textPlano) =>{
    try{
        const hash = await bcryptjs.hash(textPlano, 10); //el 10 es el numero de veces que se encripta
        return hash;
    }catch(error){
        console.log({message: "No fue posible el hash a la contraseña: " + error, status: 500});
    }
    
}

//comparación de los datos, nunca se desencripta
export const compare = async(textPlano, hash) => {
    return await bcryptjs.compare(textPlano, hash); //compara la contraseña ingresada con la contraseña encriptada
}