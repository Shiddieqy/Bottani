
void loop(){
//  if(!encoder_ready){
//    runmotor(X,-1*X_PWM);
//    if(digitalRead(LIMIT)):{
//      encoder_ready = 1;
//      runmotor(X,0);
//      encoder.setCount(0);
//    }
//  }
  currpulse = (int32_t)encoder.getCount();
  if(Serial.available()){
    setpoint = Serial.parseInt();
  }
  if((millis()-button_timer)>ts_button){
    button_timer = millis();
    xpwm = calc_pid(setpoint, currpulse);
    if(is_manual){
      sampling_spray();
    }
    else{
    runmotor(X,xpwm);
    }

    
      sampling_track();
//      
      Serial.println(" Encoder count = " + String(currpulse) + " setpoint = " + String(setpoint) + " pwm = " + String(xpwm) + String(current_sequence));
  }
  if((millis()-auto_timer)>ts_auto_spray && is_auto){
    auto_spray(spray_sequence[current_sequence]); 

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
