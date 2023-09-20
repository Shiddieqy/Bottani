int setpoint = 1000;
int xpwm = 0;
int currpulse = 0;
void loop(){
  if(Serial.available()){
    setpoint = Serial.parseInt();
  }
  if((millis()-button_timer)>ts_button){
    button_timer = millis();
    currpulse = (int32_t)encoder.getCount();
    xpwm = calc_pid(setpoint, currpulse);
//    runmotor(X,xpwm);
    
      sampling_track();
      sampling_spray();
      Serial.println(" Encoder count = " + String(currpulse) + " setpoint = " + String(setpoint) + " pwm = " + String(xpwm));
  }
  if ((millis()-sensor_timer)>ts_sensor && Ps3.isConnected()){
      Ps3.setPlayer(player);
      if(player >= 4 or player <=1){
        addition = addition*-1;
      }
      player += addition;
      sensor_timer = millis();
  }


//        return;
}
