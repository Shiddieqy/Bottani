float kp = 0.35;
float ki = 0.002;
float kd = 8.5;
int prev_error = 0;
float integral = 0;
int res;
int sign = 1;
int calc_pid(int sp, int feedback){
  int error = sp - feedback;
  int prop = error*kp;
  int difference = (error-prev_error)*kd;
  prev_error = error;
  if (abs(error)<50){
    integral = 0;
    return 0;
  }
  sign = 1;
  
//  Serial.print("prop = " + String(prop) + " d = " + String(difference));
  if (prop < 0){
    sign = -1;
  }
  if (abs(prop) > 254){
    return 255*sign;
  }
  int leftover = 255*sign - prop;
  integral += error*ki;
  if (integral*sign > leftover*sign){
    integral = leftover;
    
  }
  integral = constrain(integral,-100,100);
  
  res = prop + integral + difference;
  return constrain(res, -255, 255);
}
