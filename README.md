_Fecha: 27-11-21_

# Autores 馃
-Renet de Jes煤s P茅rez G贸mez  A01640555@tec.mx  ITC

-Adri谩n Becerra Meza  A01639813@tec.mx  ITC

-Marisol Rodr铆guez Mej铆a  A01640086@tec.mx  ITC

-Luis Enrique Lemus Mart铆nez  A01639698@tec.mx  ITD

## Descripci贸n 馃Ь
Esta es la implementaci贸n de nuestro proyecto para la materia "Implementacion del IoT". 
La aplicaci贸n consta de un servidor el cual se conecta a una base de datos RealTime en Firebase. 
El servidor fue desarrollado con NodeJS, utilizando la libreria de express, entre otras...
Tambien se adjuntan los archivos donde se desarrollo la logica para los modulos en la capa sensorial,
que por cierto se utilizo la tarjeta Node MCU 8266, para realizaar el proyecto.
    
## Para inicializarlo 馃洜
-Descarga todas las librerias.

-Correr el comando: npm run dev.

-Checar que la conexi贸n con la DB este correcta.

## Notas 馃搵
-El tiempo de duraci贸n para una reservacion es de 10s
    
-Puede haber 3 posible casos para que una reservaci贸n expire:

1. El usuario llego al lugar de la reservaci贸n (0)

2. El usuario cancelo la reservaci贸n (1)

3. Se vencio su reservaci贸n (2)
    
-Se corre un proceso hijo con un "fork", este proceso tiene la tarea de 
eliminar las reservaciones que hayan expirado. 