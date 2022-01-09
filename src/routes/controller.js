'use stric'
//Importamos librerias
const moment = require('moment');

//Importamos conexion a DB
const db = require('../connection_store/connectionStore.js');

//Esta función retorna los lugares del estacionamiento
async function lugaresEstacionamiento(){
    var jsonData = 0;
    var data = [];
    
    //Solicitamos de la base de datos los lugares
    await db.ref('lugar').once('value', (snapshot) => { jsonData = snapshot.val();});

    //Convertimos JSON a array de JSON (tenemos todos los lugares)
    for (var i in jsonData){
        constructJson = {
            "key": i,
            "idLugar": JSON.parse(jsonData[i].idLugar),
            "idSeccion": JSON.parse(jsonData[i].idSeccion),
            "lugarSeccion": JSON.parse(jsonData[i].lugarSeccion),
            "fechaInicio": jsonData[i].fechaInicio,
            "status": JSON.parse(jsonData[i].status)
        }
        data.push(constructJson);
    }

    //Guardamos en historial de lugares el tiempo que esutvo ocupado un lugar
    for (var i = 0; i < data.length; i++){
        //Si el status esta vacio y la fecha de inicio es "0"
        if (data[i].status == 0 && data[i].fechaInicio!="0"){
            //Creamos JSON con los datos de la ocupación
            var ocupacion = {
                "idLugar": data[i].idLugar,
                "fechaInicio": data[i].fechaInicio,
                "fechaFin": await moment().format(),
           }
            await db.ref('historialLugar').push(ocupacion); //Guardamos en el historial de lugares

            //Actualizamos la "fecha inicio" del lugar que se reinicie el valor
            const ref = db.ref('lugar'); // Creamos instancia para actualizar base de datos 
            //Actualizamos en base de datos el status del lugar a reservar
            const lugarRef = ref.child(data[i].key);
            lugarRef.update({ 'fechaInicio': "0" });
        }

        //Si el status esta ocupado y la fecha de inicio es "0"
        if (data[i].status == 1 && data[i].fechaInicio == "0") {
            //Actualizamos la "fecha inicio" para que su valor sea el actual (inicio de ocupacion)
            const ref = db.ref('lugar'); // Creamos instancia para actualizar base de datos 
            //Actualizamos en base de datos el status del lugar a reservar
            const lugarRef = ref.child(data[i].key);
            var now = await moment().format()
            await lugarRef.update({ 'fechaInicio': now});
        }
    }
    return data;
}

//Función para reservar un lugar
async function apartarLugarEstacionamiento(dataLugar, user){
    if (user!=0){
        key = dataLugar.key; // Obtenemos el lugar exacto donde se va a reservar
        const ref = db.ref('lugar'); // Creamos instancia para solicitar a base de datos 
        
        //Actualizamos en base de datos el status del lugar a reservar
        const lugarRef = ref.child(dataLugar.key);
        lugarRef.update({'status': 2}); 

        //Creamos Json para crear un registro del usuario quien aparto el lugar 
        const reservacion = {
            "fechaReservacion": await moment().format(),
            "fechaExpiracion": await moment().add(10, 's').format(),
            "idUsuario": user.key,
            "idLugar": dataLugar.key, 
        } 
        await db.ref('reservacion').push(reservacion);
        return 1;
    }else{
        return 0;
    }

}

//Función para desapartar un lugar
async function desapartarLugarEstacionamiento(dataLugar){
    key = dataLugar.key; //Obtenemos el identificador especifico del lugar
    const ref = db.ref('lugar'); //Instanceamos base de datos para consulta 
    const lugarRef = ref.child(dataLugar.key); //Ingresamos al registro especifico
    lugarRef.update({'status': 0}); //Actualizamos
}

//Función para verificar si el usuario ya tiene un estacionamiento apartado
async function verificarLugarUsuario(user){
    var jsonData = 0;
    await db.ref('reservacion').once('value', (snapshot) => { jsonData = snapshot.val(); });

    if (jsonData == null){
        var result = {
            "usuarioReserva": 0,
            "idLugar": 0
        }
        return result; //Significa que el usuario no tiene un lugar apartado
    }

    //Verificamos si el usuario existe
    for (var i in jsonData)
        if (user.key == jsonData[i].idUsuario){
            //Consultamos los lugares
            var jsonLugares = 0;
            await db.ref('lugar').once('value', (snapshot) => { jsonLugares = snapshot.val(); });
            //Consultamos si no ha llegado nadie al estacionamiento
            for(var j in jsonLugares){
                //Si el status del lugar de la reservación ya esta en "1"
                if (jsonData[i].idLugar == j && jsonLugares[j].status == 1){
                    var user = {"key": jsonData[i].idUsuario}
                    await desapartarLugarUsuario(user, 0); //Eliminamos la reservación del usuario (ya que ya esta en el lugar)
                    var result = {
                        "usuarioReserva": 0,
                        "idLugar": 0
                    }
                    return result; //Significa que el usuario ya llego...
                }
            }
            var result = {
                "usuarioReserva": 1,
                "idLugar": jsonData[i].idLugar
            }
            return result; //Significa que el usuario ya tiene apartado un lugar
        }
    
    var result = {
        "usuarioReserva": 0,
        "idLugar": 0
    }
    return result; //Significa que el usuario no tiene un lugar apartado
}

//Función que desaparta el lugar del usuario
async function desapartarLugarUsuario(user, tipoCancelarReservacion){
    await db.ref('reservacion').once('value', (snapshot) => { jsonData = snapshot.val(); }); //Consultamos a la DB las reservaciones
    for (var i in jsonData) 
        if (user.key == jsonData[i].idUsuario){
            //Creamos JSON con la reservacion a eliminar, para guardarla en la base de datos
            var reservacion = {
                "idHistorialReservaciones": i,
                "fechaReservacion": jsonData[i].fechaReservacion,
                "fechaExpiracion": jsonData[i].fechaExpiracion,
                "tipoExpiracion": tipoCancelarReservacion,
                "idLugar": jsonData[i].idLugar,
                "idUsuario": jsonData[i].idUsuario
           }
            await db.ref('historialReservaciones').push(reservacion); //Guardamos en el historial la reservacion y como fue eliminada
            await db.ref('reservacion/' + i).remove(); //Significa que encontro la reservacion del usuario, se procede a eliminar 
            return;
        }
}

//Función para logearse un usuario
async function signIn(tryUser){
    var jsonData = {};
    var user = false;
    await db.ref('usuario').once('value', (snapshot) => { jsonData = snapshot.val(); }); //Consultamos a DB los usuarios

    //Vreificamos si el usuario existe
    for (var i in jsonData) {
        if (tryUser.email == jsonData[i].email && tryUser.password == jsonData[i].password){
            user = {
                "key": i,
                "nombre": jsonData[i].nombre,
                "email": jsonData[i].email,
                "administrador": jsonData[i].administrador
                //"password": jsonData[i].password
            }
            break;
        }
    }

    return user;
}

//Función para registrar un nuevo usuario
async function signUp(newUser){
    //Creamos JSON con la información del nuevo usuario
    const user = {
        "nombre": newUser.nombre,
        "email": newUser.email,
        "administrador": 0,
        "password": newUser.password
    }
    await db.ref('usuario').push(user); //Ingresamos el nuevo usuario a la base de datos
    return 2;
}

//Función que obtiene toda la información para el dashboard
async function dataDashboard(){
    var numUsuario = [];
    var resrvacionesVigentes = [];
    var lugarEstacionamiento = [];
    var historialLugares = [];
    var jsonUsuario = await getDatabase('usuario');
    var jsonReservacion = await getDatabase('reservacion');
    var jsonLugar = await getDatabase('lugar');
    var jsonHistorialLugar = await getDatabase('historialLugar');

    //Acomodamos información en los arrays
    if (jsonUsuario != null) {
        for (var i in jsonUsuario) {
            var user = {
                "key": i,
                "nombre": jsonUsuario[i].nombre,
                "email": jsonUsuario[i].email,
            }
            numUsuario.push(user)
        }
    }

    if (jsonReservacion != null) {
        for (var i in jsonReservacion) {
            var reservacion = {
                "key": i,
                "fechaReservacion": jsonReservacion[i].fechaReservacion,
                "fechaExpiracion": jsonReservacion[i].fechaExpiracion,
                "idUsuario": jsonReservacion[i].idUsuario,
                "idLugar": jsonReservacion[i].idLugar
            }
            resrvacionesVigentes.push(reservacion);
        }
    }

    if (jsonLugar != null) {
        for (var i in jsonLugar) {
            var lugar = {
                "key": i,
                "idLugar": JSON.parse(jsonLugar[i].idLugar),
                "idSeccion": JSON.parse(jsonLugar[i].idSeccion),
                "lugarSeccion": JSON.parse(jsonLugar[i].lugarSeccion),
                "fechaInicio": jsonLugar[i].fechaInicio,
                "status": JSON.parse(jsonLugar[i].status)
            }
            lugarEstacionamiento.push(lugar);
        }
    }
    
    if (jsonHistorialLugar != null){
        for (var i in jsonHistorialLugar) {
            var lugarHistorial = {
                "key": i,
                "fechaInicio":jsonHistorialLugar[i].fechaInicio,
                "fechaFin": jsonHistorialLugar[i].fechaFin,
                "idLugar": JSON.parse(jsonHistorialLugar[i].idLugar)
            }

            historialLugares.push(lugarHistorial);
        }
    }
 
    //Calculamos promedio de lugar usado
    var promedioLugarOcupado = 0 
    if(historialLugares.length > 0){
        var cont = 0;
        for (var i = 0; i < historialLugares.length; i++){
            var fecha1 = await moment(historialLugares[i].fechaInicio);
            var fecha2 = await moment(historialLugares[i].fechaFin);
            cont += fecha2.diff(fecha1, 's'); //De momento esta en segundos...............
        }
        promedioLugarOcupado = Math.round(cont / historialLugares.length);
    }

    //Calculamos capacidad usada
    var capacidadUsada = 0;
    if (lugarEstacionamiento.length > 0){
        var cont = 0;
        for (var i = 0; i < lugarEstacionamiento.length; i++){
            if (lugarEstacionamiento[i].status != 0)
                cont++
        }
        var capacidadUsada = Math.round((cont / lugarEstacionamiento.length) * 100);
    }


    var data = {
        "numeroUsuario": numUsuario.length,
        "numeroReservacion": resrvacionesVigentes.length,
        "promedioLugarOcupado": promedioLugarOcupado,
        "capacidadUsada": capacidadUsada
    }

    return data;
}

//Función que obtiene toda la información para las tablas del dashboard
async function dataDashboardGraph(){
    var historialReservacion = [];
    var historialLugares = [];
    var lugarEstacionamiento = [];
    var jsonHistorialLugar = await getDatabase('historialLugar');
    var jsonHistorialReservacion = await getDatabase('historialReservaciones');
    var jsonLugar = await getDatabase('lugar');
    //Acomodamos en array el resultado de la base de datos
    if (jsonHistorialLugar != null) {
        for (var i in jsonHistorialLugar) {
            var lugarHistorial = {
                "key": i,
                "fechaInicio": jsonHistorialLugar[i].fechaInicio,
                "fechaFin": jsonHistorialLugar[i].fechaFin,
                "idLugar": JSON.parse(jsonHistorialLugar[i].idLugar)
            }

            historialLugares.push(lugarHistorial);
        }
    }

    if (jsonHistorialReservacion != null) {
        for (var i in jsonHistorialReservacion) {
            var reservacionHistorial = {
                "key": i,
                "fechaReservacion": jsonHistorialReservacion[i].fechaReservacion,
                "fechaExpiracion": jsonHistorialReservacion[i].fechaExpiracion,
                "tipoExpiracion": jsonHistorialReservacion[i].tipoExpiracion,
                "idLugar": jsonHistorialReservacion[i].idLugar,
                "idUsuario": jsonHistorialReservacion[i].idUsuario
            }

            historialReservacion.push(reservacionHistorial);
        }
    }

    if (jsonLugar != null) {
        for (var i in jsonLugar) {
            var lugar = {
                "key": i,
                "idLugar": JSON.parse(jsonLugar[i].idLugar),
                "idSeccion": JSON.parse(jsonLugar[i].idSeccion),
                "lugarSeccion": JSON.parse(jsonLugar[i].lugarSeccion),
                "fechaInicio": jsonLugar[i].fechaInicio,
                "status": JSON.parse(jsonLugar[i].status)
            }
            lugarEstacionamiento.push(lugar);
        }
    }

    //Obtenemos información de la primera grafica (tipo expiracion de reservaciones)******
    var cantidadTipoExpiracion = [];
    var nombreTipoExpiracion = ["LLego al lugar", "Cancelo reservacion", "Expiro"];
    var llegoAlLugar = 0;
    var canceloReservacion = 0;
    var reservacionExpirada = 0;

    for (var i = 0; i < historialReservacion.length; i++){
        if (historialReservacion[i].tipoExpiracion == 0){
            llegoAlLugar++;
        } else if (historialReservacion[i].tipoExpiracion == 1){
            canceloReservacion++;
        } else{
            reservacionExpirada++;
        }
    }

    cantidadTipoExpiracion.push(llegoAlLugar);
    cantidadTipoExpiracion.push(canceloReservacion);
    cantidadTipoExpiracion.push(reservacionExpirada);



    //Obtenemos información de la segunda grafica (lugar con mas reservaciones)******
    //Creamos array con los lugares
    var frecuenciaLugaresReservaciones = [];
    for (var i = 0; i < lugarEstacionamiento.length; i++){
        frecuenciaLugaresReservaciones.push({
            "idLugar": lugarEstacionamiento[i].key,
            "lugar": "Id lugar: " + lugarEstacionamiento[i].idLugar,
            "frecuencia": 0
        })
    }

    //Cuantificamos frecuencia de ocupacion de los lugares
    for (var i = 0; i < historialReservacion.length; i++) {
        for (var j = 0; j < frecuenciaLugaresReservaciones.length; j++){
            if (frecuenciaLugaresReservaciones[j].idLugar == historialReservacion[i].idLugar){
                frecuenciaLugaresReservaciones[j].frecuencia++;
                break
            }
        }
    }   
    
    //Acomodamos la información para graficar
    var nombreLugarFrecuencia =[];
    var LugarFrecuencia = [];
    for (var i = 0; i < frecuenciaLugaresReservaciones.length; i++) {
        nombreLugarFrecuencia.push(frecuenciaLugaresReservaciones[i].lugar)
        LugarFrecuencia.push(frecuenciaLugaresReservaciones[i].frecuencia)
    }   


    //Obtenemos información de la tercera grafica (Historial estacionamiento)******
    var diaLabelHistorial = [];
    var dataDataHistorial = [];

    //Traemos primer dia
    var actualDate = historialLugares[0].fechaInicio;
    
    var actualDateFrecuencia = 0;
    
    for (var i = 0; i < historialLugares.length; i++){
        actualDateFrecuencia++;

        if (await moment(actualDate).format('DD-MM-YYYY') != await moment(historialLugares[i].fechaInicio).format('DD-MM-YYYY')){
            diaLabelHistorial.push(await moment(actualDate).format("MMM Do YY")); //Guardamos fecha actual
            dataDataHistorial.push(actualDateFrecuencia); //Guardamos frecuencia
            
            //Actualizamos
            actualDate = historialLugares[i].fechaInicio
            actualDateFrecuencia = 0;
        }
        
        if(i == historialLugares.length-1){
            diaLabelHistorial.push(await moment(actualDate).format("MMM Do YY")); //Guardamos fecha actual
            dataDataHistorial.push(actualDateFrecuencia); //Guardamos frecuencia
        }
    }

    var data = {
        "graficoData1": cantidadTipoExpiracion,
        "graficoLabel1": nombreTipoExpiracion,
        "graficoData2": LugarFrecuencia,
        "graficoLabel2": nombreLugarFrecuencia,
        "graficoData3": dataDataHistorial,
        "graficoLabel3": diaLabelHistorial
    }
    return data
}

//Función para solicitar a la base de datos
async function getDatabase(param){
    var jsonData = {};
    await db.ref(param).once('value', (snapshot) => { jsonData = snapshot.val(); }); //Consultamos a DB los usuarios
    return jsonData;
} 

module.exports = {
    lugaresEstacionamiento,
    apartarLugarEstacionamiento,
    desapartarLugarEstacionamiento,
    verificarLugarUsuario,
    desapartarLugarUsuario,
    signIn,
    signUp,
    dataDashboard,
    dataDashboardGraph,
    getDatabase
}