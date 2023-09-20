enum Motor{L,R,X,Z};
int pwm[N_Motor] = {L_PWM,R_PWM,X_PWM,Z_PWM};
int forward[N_Motor] = {26,R_FORWARD,X_FORWARD,Z_FORWARD};
int m_reverse[N_Motor] = {27,R_REVERSE,X_REVERSE,Z_REVERSE};
int prev_cmd[N_Motor] = {0,0,0,0};
int increment = 15;

void runmotor(int channel,int cmd){
  if (abs(cmd)>255){
    cmd = 255*abs(cmd)/cmd;
  }
  ledcWrite(channel, abs(cmd));
  if (cmd>0){
    digitalWrite(forward[channel],HIGH);
    digitalWrite(m_reverse[channel],LOW);
  }
  else{
    digitalWrite(forward[channel],LOW);
    digitalWrite(m_reverse[channel],HIGH);
  }
}
void runmotortrack(int channel,int cmd){
  if (abs(cmd)>255){
    cmd = 255*abs(cmd)/cmd;
  }
  if (abs(prev_cmd[channel]) < abs(cmd)-increment){
    cmd = prev_cmd[channel]+increment*cmd/abs(cmd);
  }
  ledcWrite(channel, abs(cmd));
  prev_cmd[channel] = cmd;
  if (cmd>0){
    digitalWrite(forward[channel],HIGH);
    digitalWrite(m_reverse[channel],LOW);
  }
  else{
    digitalWrite(forward[channel],LOW);
    digitalWrite(m_reverse[channel],HIGH);
  }
}
