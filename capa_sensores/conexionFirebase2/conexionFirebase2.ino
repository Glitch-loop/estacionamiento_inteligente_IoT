#include <ESP8266WiFi.h>
#include "FirebaseESP8266.h"

// Variables para conexión a wifi
//#define ssid "INFINITUMCBA5_2.4"
//#define password "W7MGmXhkMd"
//#define ssid "HUAWEI_P20_lite"
//#define password "0a19d822ddbc"
//#define ssid "INFINITUM4E7F"
//#define password "kwM6nePnPU" 

#define ssid "marisol_iphone"
#define password "12344567"

// Variables para conexión a base de datos
const char *FIREBASE_HOST="https://conexion-node-8266-default-rtdb.firebaseio.com/"; 
const char *FIREBASE_AUTH="Hah2fwU4wyMjEybRVOfXRTBgLFbqVcPXoqZiVrIX";
#define API_KEY "AIzaSyAEvkjLMYDlxLdJV5C0syxlQPStdxpoWnA"


// Firebase Data object in the global scope
FirebaseData firebaseData;
bool iterar = true;

//Definimos variable de harware
//Tercer sensor
const int led1 = D0;  //Asiganmos el pin Led al pin D0
const int trig1 = D1; //Asiganmos el pin Trigger al pin D1
const int echo1 = D2; //Asiganmos el pin Echo al pin D2

//Cuarto sensor
const int led2 = D3;  //Asiganmos el pin Led al pin D0
const int trig2 = D4; //Asiganmos el pin Trigger al pin D1
const int echo2 = D5; //Asiganmos el pin Echo al pin D2


//Función para inicializar programa
void setup(){
  Serial.begin(115200);
  Serial.println();

  //Comenzamos conexión a wifi
  WiFi.begin(ssid, password); 

  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(250);
  }
  
  Serial.print("\nConectado al Wi-Fi");
  Serial.println();

  //Comenzamos conexión a base de datos
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);


   //Definimos pines
   //Primer sensor
    pinMode(D0, OUTPUT); //Configuramos el pin Led como un pin de salida
    pinMode (D1, OUTPUT); //Configuramos el pin Trigger como un pin de salida
    pinMode (D2, INPUT); //Configuramos el pin Echo como un pin de entrada

    //Segundo sensor
    pinMode(D3, OUTPUT); //Configuramos el pin Led como un pin de salida
    pinMode (D4, OUTPUT); //Configuramos el pin Trigger como un pin de salida
    pinMode (D5, INPUT); //Configuramos el pin Echo como un pin de entrada
} 


//Funcion para determinar si hay un vehiculo en el lugar
bool scanner(int trig, int echo){
  //Delcaramos variables para el calculo
  long tiempo;
  long distancia;
  
  //Comenzamos calculo
  digitalWrite(trig, LOW); //El ciclo inicia con el pin Trigger apagado
  delayMicroseconds(4); //Pasan 4 microsegundos
  digitalWrite(trig, HIGH); //Luego de ese tiempo el pin Trigger se enciende
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  tiempo = pulseIn(echo, HIGH); //El tiempo que el sonido tarda en llegar al receptor de eco es almacenado en la variable "tiempo"
  tiempo = tiempo/2; //El pin Echo ha registrado el tiempo que tarda el sonido en ir y regresar, pero solo nos interesa la mitad del recorrido
  distancia = tiempo* 0.000001 * 34300; //Fórmula para calcular la distancia (34300 velocidad del sonido en cm/s) (0.000001 para convertir tiempo a segundos
  
  //Mostramos resultado del calculo
  Serial.print (distancia);
  Serial.println ("cm");
  delay (50);

  if(distancia < 10){
   return true;
  } else {
   return false;
  }
}


//Función principal (ejecucion de programa)
void loop(){
  String path1 = "/lugar/-MpIA0Gt_nB6HirP6i9X/";
  String path2 = "/lugar/-MpIA0Gt_nB6HirP6i9Xy/";
  iterar = true;
  int cont = 0; 
  while (iterar){
    if(cont==0){
      Serial.println ("Sensor 3");
      //Pedimos a la base de datos si el lugar ya esta apartado
       bool ocupado = scanner(trig1, echo1); //Verificamos si detecta algo el sensor
  
      if(ocupado==1){ //El lugar esta ocuapdo
        Firebase.setInt(firebaseData, path1 + "/status", 1);
        digitalWrite(led1,HIGH); //El lugar ya esta ocupado
      }else{
        //Pedimos a la base de datos si el lugar ya esta apartado
        Firebase.getInt(firebaseData, path1 + "/status");
        int apartado = firebaseData.intData();
            
        if(apartado==2){
          Firebase.setInt(firebaseData, path1 + "/status", 2);
          digitalWrite(led1,HIGH); //El lugar ya esta apartado
        }else{
          Firebase.setInt(firebaseData, path1 + "/status", 0);
          digitalWrite(led1,LOW); //El lugar esta desocupado      
        }
      }  
    
    }else if(cont == 1){
      Serial.println ("Sensor 4");
      //Pedimos a la base de datos si el lugar ya esta apartado
       bool ocupado = scanner(trig2, echo2); //Verificamos si detecta algo el sensor
  
      if(ocupado==1){ //El lugar esta ocuapdo
        Firebase.setInt(firebaseData, path2 + "/status", 1);
        digitalWrite(led2,HIGH); //El lugar ya esta ocupado
      }else{
        //Pedimos a la base de datos si el lugar ya esta apartado
        Firebase.getInt(firebaseData, path2 + "/status");
        int apartado = firebaseData.intData();
            
        if(apartado==2){
          Firebase.setInt(firebaseData, path2 + "/status", 2);
          digitalWrite(led2,HIGH); //El lugar ya esta apartado
        }else{
          Firebase.setInt(firebaseData, path2 + "/status", 0);
          digitalWrite(led2,LOW); //El lugar esta desocupado      
        }
      }
    }
    cont++;
    if(cont > 2){
      cont=0;
    }
    delay(1000); 
  }
  
  Firebase.end(firebaseData);
  
} // End Loop
