
const moment = require('moment');
const db = require('../connection_store/connectionStore.js');
const controller = require('../routes/controller.js');

var reservaLugares = [];

async function actualizarVerificarExpriacion(){
    // console.log('Consultamos a DB')
    var jsonData = {}
    await db.ref('reservacion').once('value', (snapshot) => { jsonData = snapshot.val(); }); //Consultamos a DB los usuarios
    if(jsonData!=null){
        // console.log('Si hay reservaciones en la db')
        reservaLugares.splice(0, reservaLugares.length);
        for (var i in jsonData) {
            user = {
                "key": i,
                "fechaExpiracion": jsonData[i].fechaExpiracion,
                "fechaReservacion": jsonData[i].fechaReservacion,
                "idLugar": jsonData[i].idLugar,
                "idUsuario": jsonData[i].idUsuario
            }
            reservaLugares.push(user);
            break;
        }
    }
}

async function verificarExpriacion(){
    // console.log('verificamos fecha de expiracion');
    if (reservaLugares.length != 0) { //Significa que hay reservaciones
        // Accedemos a cada una
        for(var i=0; i < reservaLugares.length; i++){
            if (moment().format() > moment(reservaLugares[i].fechaExpiracion).format()){
                console.log('Se elimino la reservación del usuario con el id: ', reservaLugares[i].idUsuario);
                // console.log(reservaLugares[i]);
                //Si es cierto significa que el tiempo de la reservación ya expiro
                //Guardamos reservación en historial de reservaciones
                //Creamos JSON con el historial
                var user = { "key": reservaLugares[i].idUsuario }
                await controller.desapartarLugarUsuario(user, 2); //Eliminamos la reservacion (con el tipo de cancelación)

                const ref = db.ref('lugar'); // Creamos instancia para solicitar a base de datos 

                //Actualizamos en base de datos el status del lugar a reservar
                const lugarRef = ref.child(reservaLugares[i].idLugar);
                lugarRef.update({ 'status': 0 });
                

                reservaLugares.splice(i, 1); //Procedemos a eliminar ese dato de la matriz
            }
        }
    }
}

setInterval(verificarExpriacion, 10000);
setInterval(actualizarVerificarExpriacion, 60000);