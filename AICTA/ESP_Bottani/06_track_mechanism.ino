int left_value = 0;
int right_value = 0;

void runtrack(int left,int right){
  runmotor(L,PWM_L*left);
  runmotor(R,PWM_R*right);
}
void sampling_track(){
  left_value = 0;
  right_value = 0;
  if(button_up){
    left_value += 1;
    right_value += 1;
  }
   if(button_down){
    left_value -= 1;
    right_value -= 1;
  }
    if(button_right){
    left_value += 1;
    right_value -= 1;
  }
    if(button_left){
    left_value -= 1;
    right_value += 1;
  }

//  Serial.print(left_value);
//  Serial.print("\t");
//  Serial.print(right_value);
//    Serial.print("\t");
  runtrack(left_value,right_value);
  Serial.print(prev_cmd[0]);
  Serial.print("\t");
  Serial.print(prev_cmd[1]);
  Serial.print("\t");
//  Serial.println(sensor_state);
}
