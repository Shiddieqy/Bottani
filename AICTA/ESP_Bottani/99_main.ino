
void loop(){
//  if((millis()-button_timer)>ts_button){
//    button_timer = millis();
////      parse_button();
////      sampling_track();
////      sampling_spray();
////  }
  // if ((millis()-UART_timer)>ts_UART){
  //     // printData();
  //     UART_timer = millis();
  // }
  Serial.println("test");
      getAndParseDataFromUART();

  // if ((millis()-sensor_timer)>ts_sensor && Ps3.isConnected()){

  //     getAndParseDataFromUART();

  //     Ps3.setPlayer(player);
  //     if(player >= 4 or player <=1){
  //       addition = addition*-1;
  //     }
  //     player += addition;
  //     sensor_timer = millis();
      
  // }


//        return;
}
