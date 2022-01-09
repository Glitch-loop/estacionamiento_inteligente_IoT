const admin = require('firebase-admin');

const serviceAccount = require("../conexion-node-8266-firebase-adminsdk-zom3v-f437c2445d.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://conexion-node-8266-default-rtdb.firebaseio.com/'
});

const db = admin.database();

module.exports = db;