//
//// Insert Firebase project API Key
//#define API_KEY "AIzaSyDsccWUW75IWCHSC1XDPPv9ui8uMM7W1iE"
//
//// Insert RTDB URLefine the RTDB URL */
//#define DATABASE_URL "https://robot-bottani-default-rtdb.firebaseio.com/" 
//
////Define Firebase Data object
//FirebaseData fbdo;
//
//FirebaseAuth auth;
//FirebaseConfig config;
//
//unsigned long sendDataPrevMillis = 0;
//int count = 0;
//bool signupOK = false;
//
//void firebase_setup(){
//  config.api_key = API_KEY;
//
//  config.database_url = DATABASE_URL;
//
//  if (Firebase.signUp(&config, &auth, "", "")){
//    Serial.println("ok");
//    signupOK = true;
//  }
//  else{
//    Serial.printf("%s\n", config.signer.signupError.message.c_str());
//  }
//  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
//  Firebase.begin(&config, &auth);
//  Firebase.reconnectWiFi(true);
//}
//
//void publish_float(float Data,String adress){
//  Firebase.RTDB.setFloat(&fbdo, adress, Data);
//}
//
//int subscribe_int(String address){
//  Firebase.RTDB.getFloat(&fbdo, address);
//  return fbdo.intData();
//}
//
////void parse_button(){
////  btn = subscribe_int(BUTTON_TOPIC);
////  button_up = (btn)&1;
////  button_down = (btn&2)>>1;
////  button_right = (btn&4)>>2;
////  button_left = (btn&8)>>3;
////  button_s_up = (btn&16)>>4;
////  button_s_down = (btn&32)>>5;
////  button_s_right = (btn&64)>>6;
////  button_s_left = (btn&128)>>7;
////  button_s_spray = (btn&256)>>8;
////  
////}
