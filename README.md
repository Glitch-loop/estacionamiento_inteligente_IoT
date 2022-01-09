_Fecha: 27-11-21_

# Autores 🤝
-Renet de Jesús Pérez Gómez  A01640555@tec.mx  ITC

-Adrián Becerra Meza  A01639813@tec.mx  ITC

-Marisol Rodríguez Mejía  A01640086@tec.mx  ITC

-Luis Enrique Lemus Martínez  A01639698@tec.mx  ITD

## Descripción 🧾
Esta es la implementación de nuestro proyecto para la materia "Implementacion del IoT". 
La aplicación consta de un servidor el cual se conecta a una base de datos RealTime en Firebase. 
El servidor fue desarrollado con NodeJS, utilizando la libreria de express, entre otras...
Tambien se adjuntan los archivos donde se desarrollo la logica para los modulos en la capa sensorial,
que por cierto se utilizo la tarjeta Node MCU 8266, para realizaar el proyecto.
    
## Para inicializarlo 🛠
-Descarga todas las librerias.

-Correr el comando: npm run dev.

-Checar que la conexión con la DB este correcta.

## Notas 📋
-El tiempo de duración para una reservacion es de 10s
    
-Puede haber 3 posible casos para que una reservación expire:

1. El usuario llego al lugar de la reservación (0)

2. El usuario cancelo la reservación (1)

3. Se vencio su reservación (2)
    
-Se corre un proceso hijo con un "fork", este proceso tiene la tarea de 
eliminar las reservaciones que hayan expirado. 