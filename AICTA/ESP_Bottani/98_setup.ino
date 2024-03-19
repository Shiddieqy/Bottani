void setup(){
  Serial.begin(115200);
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  myservo.setPeriodHertz(50);    // standard 50 hz servo

  ESP32Encoder::useInternalWeakPullResistors=UP;
  
  // use pin 19 and 18 for the first encoder
  encoder.attachHalfQuad(encXa, encXb);
  // use pin 17 and 16 for the second encoder
//  encoder2.attachHalfQuad(17, 16);
    
  // set starting count value after attaching
  encoder.setCount(0);
  Ps3.attach(notify);
  Ps3.attachOnConnect(onConnect);
  
//  Ps3.attachOnDisconnect(ESP.restart(););
  
  Ps3.begin("00:1b:10:00:2a:ec");
//  while(!Ps3.isConnected()){
//    
//  }

  Serial.println("Ready.");
//  wifi_setup();
//  firebase_setup();
  ledcSetup(L, PWM_FREQUENCY , PWM_RES);
  ledcAttachPin(L_PWM, L);

  ledcSetup(R, PWM_FREQUENCY , PWM_RES);
  ledcAttachPin(R_PWM, R);

  ledcSetup(X, PWM_FREQUENCY , PWM_RES);
  ledcAttachPin(X_PWM, X);

  ledcSetup(Z, PWM_FREQUENCY , PWM_RES);
  ledcAttachPin(Z_PWM, Z);
    ledcSetup(S, PWM_FREQUENCY , PWM_RES);
  ledcAttachPin(S_PWM, S);
    myservo.attach(SERVO_PIN,1000,2000);
  myservo.write(OPEN_DEGREE);
  myservo.write(CLOSE_DEGREE);
  pinMode(L_FORWARD,OUTPUT);
  pinMode(L_REVERSE,OUTPUT);
  pinMode(R_FORWARD,OUTPUT);
  pinMode(R_REVERSE,OUTPUT);
  pinMode(X_FORWARD,OUTPUT);
  pinMode(X_REVERSE,OUTPUT);
  pinMode(Z_FORWARD,OUTPUT);
  pinMode(Z_REVERSE,OUTPUT);
  pinMode(S_FORWARD,OUTPUT);
  pinMode(S_REVERSE,OUTPUT);
  pinMode(PUMP,OUTPUT);
  pinMode(LIMIT,INPUT_PULLUP);
}
