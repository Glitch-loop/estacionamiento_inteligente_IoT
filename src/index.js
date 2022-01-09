'use strict'

//Importamos librerias
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { fork } = require('child_process');
const cors = require('cors');

//Importamos componentes
const routes = require('./routes/network.js');
const config = require('./config.js');

//Inicializamos express
const app = express();

//Establecemos motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

//Uso de middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Router
app.get('/', function(req, res){
    var data = 0
    res.render('menuPrincipal', { data });
});
 
//Especificamos uso de aplicacion
app.use('/src/routes', routes);


//Iniciano servidor
app.listen(config.api.port, ()=>{
    console.log('Escuchando en puerto: ', config.api.port);
});

//Iniciando proceso hijo (verificador de apartado de estacionamiento)
console.log('Inicializando proceso hijo (Verificación de expiración de reservaciones)')
const child = fork(__dirname + '/child_process/verificadorApartadoEstacionamiento.js');
child.on('error', (err) => {});