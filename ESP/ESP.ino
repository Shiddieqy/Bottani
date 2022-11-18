#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>
#include <Arduino_JSON.h>
#include <analogWrite.h>

#define LIMIT_SWITCH_X0 14
#define LIMIT_SWITCH_XT 12
#define LIMIT_SWITCH_Z0 15
#define LIMIT_SWITCH_ZT 0
#define ENA_PIN 19
#define ENB_PIN 21
#define ENC_PIN 22
#define END_PIN 23
#define SERVO 32
#define UP 1
#define DOWN 2
#define LEFT 3
#define RIGHT 4
#define UP_LEFT 5
#define UP_RIGHT 6
#define DOWN_LEFT 7
#define DOWN_RIGHT 8
#define TURN_LEFT 9
#define TURN_RIGHT 10
#define STOP 0
const char PWM_DEFAULT_VALUE[3] = "50";

#define LEFT_MOTOR 0
#define RIGHT_MOTOR 1

#define FORWARD 1
#define BACKWARD -1

struct MOTOR_PINS
{
  int pinIN1;
  int pinIN2;    
};

std::vector<MOTOR_PINS> motorPins = 
{
  {27, 26},  //LEFT_MOTOR
  {25, 33},  //RIGHT_MOTOR
  {34, 35},  //LEFT_MOTOR
  {36, 39},  //RIGHT_MOTOR
     
};

const char* ssid     = "Cody Kit Jelek";
const char* password = "12345678";

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");



//========================
String message = "";
String sliderValue1 = "0";
String sliderValue2 = "0";
String sliderValue3 = "0";
String sliderValue4 = "0";
String sliderValue5 = "0";
String sliderPWM= PWM_DEFAULT_VALUE;
const int resolution = 8;

JSONVar sliderValues;
//=========================

String getSliderValues(){
  sliderValues["sliderValue1"] = String(sliderValue1);
  sliderValues["sliderValue2"] = String(sliderValue2);
  sliderValues["sliderValue3"] = String(sliderValue3);
  sliderValues["sliderValue4"] = String(sliderValue4);
  sliderValues["sliderValue5"] = String(sliderValue5);
  sliderValues["sliderPWM"] = String(sliderPWM);

  String jsonString = JSON.stringify(sliderValues);
  return jsonString;
}
bool kanan_mentok = 0;
bool kiri_mentok = 0;
bool atas_mentok = 0;
bool bawah_mentok = 0;
void IRAM_ATTR isr1() {
  kanan_mentok = 1;
}
void IRAM_ATTR isr2() {
  kiri_mentok = 1;
}
void IRAM_ATTR isr3() {
  atas_mentok = 1;
}
void IRAM_ATTR isr4() {
  bawah_mentok = 1;
}

const char* htmlHomePage PROGMEM = R"HTMLHOMEPAGE(
            <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <style>


        .arrows {
        font-size:70px;
        color:#034078;
        }
        .circularArrows {
        font-size:80px;
        color:#034078;
        }
        td {
        background-color:#FFD65C;
        border-radius:25%;
        display:table-cell;
        text-align: center;
           
        }
        td:active {
        transform: translate(5px,5px);
        box-shadow: none; 
        }


            .card-grid {
            max-width: 700px;
            margin: 0 auto;
            display: grid;
            grid-gap: 2rem;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .card-title {
            font-size: 1.2rem;
            font-weight: bold;
            color: #034078
        }

        .robotname{
            margin: 2px;
        }
        .state {
            font-size: 1.2rem;
            color:#034078;
        }
        .slider {
            flex-grow: 1;
            -webkit-appearance: none;
            margin: 0 auto;
            width: 90%;
            height: 15px;
            border-radius: 10px;
            background: #FFD65C;
            outline: none;
        }
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #034078;
            cursor: pointer;
        }
        .slider::-moz-range-thumb {
            width: 30px;
            height: 30px;
            border-radius: 50% ;
            background: #034078;
            cursor: pointer;
        }
        .switch {
            padding-left: 5%;
            padding-right: 5%;
        }

        .slider-wrapper{
            width: 100%;
            display: grid;
            grid-template-columns: 50% 50%;
            justify-content: center;
            
        }

        .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                    user-select: none; /* Non-prefixed version, currently
                                        supported by Chrome and Opera */
        }
        
        </style>
    </head>
    <body class="noselect" align="center" style="background-color:white">
        
        <h1 style="color: teal;text-align:center;">Cody-Kit</h1>
        <!--<h2 style="color: teal;text-align:center;">Wi-Fi &#128663; Control</h2>-->
        
        <hr>
        <h2 class="robotname" style="color: #034078;text-align:center;">Arm Robot</h2>
        <hr>
        <div class="slider-wrapper">
            <div class="card">
                <p class="card-title">Base</p>
                <p class="switch">
                <input type="range" onchange="updateSliderPWM(this)" id="slider1" min="-90" max="90" step="1" value ="0" class="slider">
                </p>
                <p class="state">Angle: <span id="sliderValue1">0</span></p>
            </div>
        
            <div class="card">
                <p class="card-title">Lengan Bawah</p>
                <p class="switch">
                <input type="range" onchange="updateSliderPWM(this)" id="slider2" min="-90" max="90" step="1" value ="0" class="slider">
                </p>
                <p class="state">Angle: <span id="sliderValue2">0</span> </p>
            </div>
        
            <div class="card">
                <p class="card-title">Lengan Atas</p>
                <p class="switch">
                <input type="range" onchange="updateSliderPWM(this)" id="slider3" min="-90" max="90" step="1" value ="0" class="slider">
                </p>
                <p class="state">Angle: <span id="sliderValue3">0</span> </p>
            </div>

            <div class="card">
                <p class="card-title">Angular</p>
                <p class="switch">
                <input type="range" onchange="updateSliderPWM(this)" id="slider4" min="-90" max="90" step="1" value ="0" class="slider">
                </p>
                <p class="state">Angle: <span id="sliderValue4">0</span> </p>
            </div>

            <div class="card">
                <p class="card-title">Gripper</p>
                <p class="switch">
                <input type="range" onchange="updateSliderPWM(this)" id="slider5" min="-90" max="90" step="1" value ="0" class="slider">
                </p>
                <p class="state">Angle: <span id="sliderValue5">0</span> </p>
            </div>
            
        </div>
        

        <hr>
        <h2 class="robotname" style="color: #034078;text-align:center;">Mobile Robot</h2>
        <hr>

        <div class="card">
            <p class="card-title">PWM</p>
            <p class="switch">
            <input type="range" onchange="updateSliderPWM(this)" id="slider6" min="0" max="255" step="1" value ="50" class="slider">
            </p>
            <p class="state">Speed: <span id="sliderValue6">50</span> </p>
        </div>


        <table id="mainTable" style="width:400px;margin:auto;table-layout:fixed" CELLSPACING=10>  
        <tr>
            <td ontouchstart='onTouchStartAndEnd("5")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#11017;</span></td>
            <td ontouchstart='onTouchStartAndEnd("1")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#8679;</span></td>
            <td ontouchstart='onTouchStartAndEnd("6")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#11016;</span></td>
        </tr>
        
        <tr>
            <td ontouchstart='onTouchStartAndEnd("3")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#8678;</span></td>
            <td></td>    
            <td ontouchstart='onTouchStartAndEnd("4")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#8680;</span></td>
        </tr>
        
        <tr>
            <td ontouchstart='onTouchStartAndEnd("7")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#11019;</span></td>
            <td ontouchstart='onTouchStartAndEnd("2")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#8681;</span></td>
            <td ontouchstart='onTouchStartAndEnd("8")' ontouchend='onTouchStartAndEnd("0")'><span class="arrows" >&#11018;</span></td>
        </tr>
        
        
        </table>

        <script>
        var webSocketUrl = "ws:\/\/" + window.location.hostname + "/ws";
        var websocket;
        
        var rangeslider = document.getElementById("sliderRange");
        
        

        function initWebSocket() 
        {
            websocket = new WebSocket(webSocketUrl);
            websocket.onopen    = function(event){};
            websocket.onclose   = function(event){setTimeout(initWebSocket, 2000);};
            websocket.onmessage = function(event){};
        }

        function onTouchStartAndEnd(value) 
        {
            websocket.send(value);
        }
        
        

        function updateSliderPWM(element) {
            var sliderNumber = element.id.charAt(element.id.length-1);
            if(element.id.charAt(element.id.length-1) == ''){
                sliderNumber = 0;
            }
            var sliderValue = document.getElementById(element.id).value;
            document.getElementById("sliderValue"+sliderNumber).innerHTML = sliderValue;
            websocket.send(sliderNumber+"s"+sliderValue.toString());
            console.log(sliderNumber+"s"+sliderValue.toString());

        }

        function onMessage(event) {
            console.log(event.data);
            var myObj = JSON.parse(event.data);
            var keys = Object.keys(myObj);

            for (var i = 0; i < keys.length; i++){
                var key = keys[i];
                document.getElementById(key).innerHTML = myObj[key];
                document.getElementById("slider"+ (i+1).toString()).value = myObj[key];
                
            }
        }

        window.onload = initWebSocket;
        document.getElementById("mainTable").addEventListener("touchend", function(event){
            event.preventDefault()
        }); 
        
        
        
        </script>
        
    </body>
    </html> 



)HTMLHOMEPAGE";


void rotateMotor(int motorNumber, int motorDirection)
{
  int PWM_value = sliderPWM.toInt();
  analogWrite(ENA_PIN, PWM_value);
  analogWrite(ENB_PIN, PWM_value);
  if (motorDirection == FORWARD)
  {
    digitalWrite(motorPins[motorNumber].pinIN1, HIGH);
    digitalWrite(motorPins[motorNumber].pinIN2, LOW);    
  }
  else if (motorDirection == BACKWARD)
  {
    digitalWrite(motorPins[motorNumber].pinIN1, LOW);
    digitalWrite(motorPins[motorNumber].pinIN2, HIGH);     
  }
  else
  {
    digitalWrite(motorPins[motorNumber].pinIN1, LOW);
    digitalWrite(motorPins[motorNumber].pinIN2, LOW);       
  }
}

void processCarMovement(String inputValue)
{
  
//  Serial.printf("Got value as %s %d\n", inputValue.c_str(), inputValue.toInt());
  switch(inputValue.toInt())
  {

    case UP:
      rotateMotor(LEFT_MOTOR, FORWARD);
      rotateMotor(RIGHT_MOTOR, FORWARD);                
      break;
  
    case DOWN:
      rotateMotor(LEFT_MOTOR, BACKWARD);
      rotateMotor(RIGHT_MOTOR, BACKWARD);  
      break;
  
    case LEFT:
      rotateMotor(LEFT_MOTOR, FORWARD);
      rotateMotor(RIGHT_MOTOR, BACKWARD);   
      break;
      
    case RIGHT:
      rotateMotor(LEFT_MOTOR, BACKWARD);
      rotateMotor(RIGHT_MOTOR, FORWARD);    
      break;
  
    case UP_LEFT:
      rotateMotor(LEFT_MOTOR, FORWARD);
      rotateMotor(RIGHT_MOTOR, STOP);
      break;
  
    case UP_RIGHT:
      rotateMotor(LEFT_MOTOR, STOP);
      rotateMotor(RIGHT_MOTOR, FORWARD);  
      break;
  
    case DOWN_LEFT:
      rotateMotor(LEFT_MOTOR, BACKWARD);
      rotateMotor(RIGHT_MOTOR, STOP);  
      break;
  
    case DOWN_RIGHT:
      rotateMotor(LEFT_MOTOR, STOP);
      rotateMotor(RIGHT_MOTOR, BACKWARD);
      break;

    case STOP:
      rotateMotor(LEFT_MOTOR, STOP);
      rotateMotor(RIGHT_MOTOR, STOP); 
      break;
  
    default:
      rotateMotor(LEFT_MOTOR, STOP);
      rotateMotor(RIGHT_MOTOR, STOP);   
      break;
  }
}

void handleRoot(AsyncWebServerRequest *request) 
{
  request->send_P(200, "text/html", htmlHomePage);
}

void handleNotFound(AsyncWebServerRequest *request) 
{
    request->send(404, "text/plain", "File Not Found");
}


void onWebSocketEvent(AsyncWebSocket *server, 
                      AsyncWebSocketClient *client, 
                      AwsEventType type,
                      void *arg, 
                      uint8_t *data, 
                      size_t len) 
{            
  AwsFrameInfo *info = (AwsFrameInfo*)arg;
  if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
    data[len] = 0;
    message = (char*)data;
      if (message.indexOf("1s") >= 0) {
        sliderValue1 = message.substring(2);
         Serial.println(getSliderValues());
      }
      if (message.indexOf("2s") >= 0) {
        sliderValue2 = message.substring(2);
        Serial.println(getSliderValues());
      }    
      if (message.indexOf("3s") >= 0) {
        sliderValue3 = message.substring(2);
        Serial.println(getSliderValues());
      }

      if (message.indexOf("4s") >= 0) {
        sliderValue4 = message.substring(2);
        Serial.println(getSliderValues());
      }

      if (message.indexOf("5s") >= 0) {
        sliderValue5 = message.substring(2);
        Serial.println(getSliderValues());
      }
      if (message.indexOf("6s") >= 0) {
        sliderPWM = message.substring(2);
      }
//      if (strcmp((char*)data, "getValues") == 0) {
//        notifyClients(getSliderValues());
//      }
  }
  switch (type) 
  {
    case WS_EVT_CONNECT:
//      Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
      //client->text(getRelayPinsStatusJson(ALL_RELAY_PINS_INDEX));
      break;
    case WS_EVT_DISCONNECT:
//      Serial.printf("WebSocket client #%u disconnected\n", client->id());
      processCarMovement("0");
      break;
    case WS_EVT_DATA:
      AwsFrameInfo *info;
      info = (AwsFrameInfo*)arg;
      if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) 
      {
        std::string myData = "";
        myData.assign((char *)data, len);
        if(myData.c_str()[1] == 's'){
          processCarMovement("0");
        }
        else{
          processCarMovement(myData.c_str());
        }
      }
      break;
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
      break;
    default:
      break;  
  }

}

void setUpPinModes()
{
  pinMode(ENA_PIN, OUTPUT);
  pinMode(ENB_PIN, OUTPUT);
  pinMode(ENC_PIN, OUTPUT);
  pinMode(END_PIN, OUTPUT);
  for (int i = 0; i < motorPins.size(); i++)
  {
    pinMode(motorPins[i].pinIN1, OUTPUT);
    pinMode(motorPins[i].pinIN2, OUTPUT);  
    rotateMotor(i, STOP);  
  }
  attachInterrupt(LIMIT_SWITCH_X0, isr1, RISING);
  attachInterrupt(LIMIT_SWITCH_XT, isr2, RISING);
  attachInterrupt(LIMIT_SWITCH_Z0, isr3, RISING);
  attachInterrupt(LIMIT_SWITCH_ZT, isr4, RISING);
}


void setup(void) 
{
  setUpPinModes();
  Serial.begin(9600);

  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
//  Serial.print("AP IP address: ");
//  Serial.println(IP);

  server.on("/", HTTP_GET, handleRoot);
  server.onNotFound(handleNotFound);
  
  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);
  
  server.begin();
//  Serial.println("HTTP server started");
}

void loop() 
{ 
  ws.cleanupClients();
} 
