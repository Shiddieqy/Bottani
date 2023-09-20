void sampling_sram(){


//  Serial.print(left_value);
//  Serial.print("\t");
//  Serial.print(right_value);
//    Serial.print("\t");
  runmotor(S,sensor_state*PWM_S);
  Serial.print(prev_cmd[0]);
  Serial.print("\t");
  Serial.print(prev_cmd[1]);
  Serial.print("\t");
  Serial.println(prev_cmd[4]);
}
