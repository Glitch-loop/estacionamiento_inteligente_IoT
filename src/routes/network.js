'use strict'
//Importamos libreria
const express = require("express");

//Importamos controlador
const controller = require('./index.js');

//Inicializamos router
const router = express.Router();

//Rutas 
//Estacionamiento
router.get('/', menuEstacionamiento) //Menu principal
router.post('/apartarLugar', apartarLugarEstacionamiento) //Menu principal
router.post('/desapartarLugar', desapartarLugarEstacionamiento) //Menu principal

// Usuario
router.post('/signIn', signIn) //Menu principal
router.get('/signUp', signUpView) //Menu principal
router.post('/signUp', signUp) //Menu principal
router.get('/logout', logout) //Menu principal

//Dashboard
router.get('/dashboard', dashboardRender);
router.get('/obtenerData', dashboardDataTable);

//Variables globales para registro de usuario
var user = 0;

//Función que renderiza el menu de estacionamientos
async function menuEstacionamiento(req, res){
    if(user==0){
        var data = 0;
        res.render('menuPrincipal', { data });
    }
    var data = 0;
    //Verifica si hay un lugar apartado por el usuario
    var lugarApartado = await controller.verificarLugarUsuario(user);
    //Traemos todos los lugares del estacionamiento
    data = await controller.lugaresEstacionamiento();
    res.render('module/menuEstacionamiento', { data, user, lugarApartado });


}

//Función para apartar un lugar
async function apartarLugarEstacionamiento(req, res){
    var estatusApp = await controller.apartarLugarEstacionamiento(req.body, user);
    if(estatusApp==1){
        res.redirect('/src/routes'); //Redirigimos al menu estacionamiento
    }else{
        var data = 0;
        res.render('menuPrincipal', { data });
    }
}

//Función para desapartar un lugar
async function desapartarLugarEstacionamiento(req, res){
    await controller.desapartarLugarEstacionamiento(req.body); //Cambia el status del estacionamiento a desaparado 
    await controller.desapartarLugarUsuario(user,1); //Borramos la reservación a nombre del usuario
    res.redirect('/src/routes'); //Redirigimos al menu estacionamiento
}

//Función para verificar si el usuario realmente existe
async function signIn(req, res){
    user = await controller.signIn(req.body);
    if(!user){
        var data = 1
        res.render('menuPrincipal', { data });
    }else{
        res.redirect('/src/routes'); //Redirigimos al menu estacionamiento
    }
}

//Renderiza el formulario para ingresar un nuevo usuario
async function signUpView(req, res){
    res.render('module/registroUsuario');
}

//Registra un nuevo usuario
async function signUp(req, res){
    var data = await controller.signUp(req.body);
    res.render('menuPrincipal', { data })
}

//Finaliza la sesión de un usuario
async function logout(req, res){
    user = 0;
    var data = 0;
    res.render('menuPrincipal', { data })
}

//Función que renderiza el dashboard
async function dashboardRender(req, res){
    var data = await controller.dataDashboard();
    res.render('module/dashBoard', { data, user });
}

//Función que obtiene la información para poder graficarla
async function dashboardDataTable(req, res){
    var data = await controller.dataDashboardGraph();
    res.send({ data });
}
module.exports = router;


