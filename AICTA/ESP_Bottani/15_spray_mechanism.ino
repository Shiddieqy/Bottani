int z_value = 0;
int x_value = 0;
int s_value = 0;
void lower_z(){
  runmotor(Z,PWM_Z*(-1));
  delay(300);
}
void upper_z(){
  runmotor(Z,PWM_Z);
  delay(400);
}
void spray(){
  digitalWrite(PUMP,1);
  myservo.write(OPEN_DEGREE);
  delay(400);
  digitalWrite(PUMP,0);
  myservo.write(CLOSE_DEGREE);
  
}
void sampling_spray(){
  z_value = 0;
  x_value = 0;
  s_value = 0;
  if(button_s_up){
    z_value = 1;
  }
  else if(button_s_down){
    z_value = -1;
  }
  if(button_s_right){
    x_value = 1;
  }
  else if(button_s_left){
    x_value = -1;
  }
  if(button_s_spray){
    s_value = 1;
  }
  if(s_value){
//    Ps3.setRumble(100.0);
  }
  else{
    Ps3.setRumble(0.0);
  }
  if(sensor_motor){
    runmotor(S,PWM_S);
  }
  else if(sensor_motordown){
    runmotor(S,PWM_S*-1);
  }
  else{
    runmotor(S,0);
  }
  runmotor(Z,PWM_Z*z_value);
  runmotor(X,PWM_X*x_value);
//  Serial.print(z_value);
//  Serial.print("\t");
//  Serial.print(x_value);
//  Serial.print("\t");
//  Serial.println(s_value);
  digitalWrite(PUMP,s_value);
//  if(s_value){
//     myservo.write(OPEN_DEGREE);
//  }
//  else{
//  myservo.write(CLOSE_DEGREE);
//  }
}
void auto_spray(int command){
  switch(command)
  {
    case MID:
      if(set_sprayer(MID_PULSE)){
        current_sequence++;
      }
      break;
    case LEFT:
      if(set_sprayer(LEFT_PULSE)){
          current_sequence++;
        }
      break;
    case RIGHT:
      if(set_sprayer(RIGHT_PULSE)){
        current_sequence++;
      }
      break;
    case SPRAYING:
      lower_z();
      spray();
      upper_z();
      runmotor(Z,0);
      current_sequence++;
      break; 
    case END:
      current_sequence = 0;
      is_auto = 0;
      break;     
    }

//       current_sequence++;
//    if(spray_sequence[current_sequence] == "\0"){
//      current_sequence = 0;
//}
}
int set_sprayer(int sp){

    setpoint = sp;

    if(abs(sp-currpulse) < PULSE_TOLERANCE){
      return 1;
    }
    else{
      return 0;
}
}
