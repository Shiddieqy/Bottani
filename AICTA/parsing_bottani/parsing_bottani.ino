#include <Arduino.h>

const int maxPlants = 10;  // Adjust this based on your needs
int idArray[maxPlants];
float xArray[maxPlants];
float yArray[maxPlants];
int numPlants = 0;


const int pinFwd = 22;
const int pinBwd = 23;
const int pinPWM = 12;

class Motor{
  private:
    int pinForward;
    int pinBackward;
    int pinPWM;
    int convertPWMToDigitalValue(float pwm);

  public:
    Motor(int pinForward, int pinBackward, int pinPWM): pinForward(pinForward), pinBackward(pinBackward), pinPWM(pinPWM){}
    void setUpPin();
    void speed(float pwm);
    
};

int Motor::convertPWMToDigitalValue(float pwm){
  return (int) (pwm/1.0 * 255);
}

void Motor::setUpPin(){
  pinMode(this->pinForward, OUTPUT);
  pinMode(this->pinBackward, OUTPUT);
  pinMode(this->pinPWM, OUTPUT);
  ledcSetup(0, 5000, 8);
  ledcAttachPin(this->pinPWM, 0);
}

void Motor::speed(float pwm){
  if(pwm > 0.0){
    digitalWrite(this->pinForward, HIGH);
    digitalWrite(this->pinBackward, LOW);
    int dutyCycle = convertPWMToDigitalValue(pwm);
    ledcWrite(0, 100);
  }
  else{
    digitalWrite(this->pinForward, LOW);
    digitalWrite(this->pinBackward, HIGH);
    int dutyCycle = convertPWMToDigitalValue(pwm);
    ledcWrite(0, 100);
  }
}


Motor motor(pinFwd, pinBwd, pinPWM);

// Define the pins for the encoder
const int ENC_A_PIN = 25;
const int ENC_B_PIN = 26;

volatile int encoderCount = 0;
volatile int lastEncoded = 0;
volatile boolean encASet = false;
volatile boolean encBSet = false;

void updateEncoder() {
  int MSB = digitalRead(ENC_A_PIN); // Read the state of ENC_A_PIN
  int LSB = digitalRead(ENC_B_PIN); // Read the state of ENC_B_PIN
  // Serial.println(String(digitalRead(ENC_A_PIN)) + " " + String(digitalRead(ENC_B_PIN)));
  
  int encoded = (MSB << 1) | LSB; // Convert the two binary inputs to a single decimal number
  
  int sum = (lastEncoded << 2) | encoded; // Combine previous and current states for a 2-bit history
  
  if (sum == 0b1101 || sum == 0b0100 || sum == 0b0010 || sum == 0b1011) {
    encoderCount++;
  }
  if (sum == 0b1110 || sum == 0b0111 || sum == 0b0001 || sum == 0b1000) {
    encoderCount--;
  }
  
  lastEncoded = encoded; // Store this value for next time
}


void setUpEncoder(){
  
  pinMode(ENC_A_PIN, INPUT);
  pinMode(ENC_B_PIN, INPUT);
  
  attachInterrupt(digitalPinToInterrupt(ENC_A_PIN), updateEncoder, CHANGE);
  attachInterrupt(digitalPinToInterrupt(ENC_B_PIN), updateEncoder, CHANGE);
}

const byte bufferSize = 100;  // Adjust this based on your data length
char buffer[bufferSize];
byte bufferIndex = 0;


void processPlantData() {
  int plantCount;
  int currentIndex = 0;  // Skip the '#' character
  numPlants = 0;
//  Serial.println("Raw data: " + String(buffer));
  if (sscanf(buffer + currentIndex, "%d", &plantCount) == 1) {
    currentIndex = findNextSpace(buffer, currentIndex);
    for (int i = 0; i < plantCount && currentIndex != -1; i++) {
      int id;
      float x, y;
      currentIndex = findNextSpace(buffer, currentIndex ); // Move past the space character
      if (sscanf(buffer + currentIndex, "%d %f %f", &id, &x, &y) == 3) {
        idArray[numPlants] = id;
        xArray[numPlants] = x;
        yArray[numPlants] = y;
        numPlants++;
        if (numPlants >= maxPlants) {
          break;  // Limit reached
        }
      }
      for(int i=0; i<3; i++){ 
        currentIndex = findNextSpace(buffer, currentIndex+1);
      }
    }
  }


}

void getAndParseDataFromUART(){
  if (Serial.available()) {  // Read from Serial2
    char c = Serial.read();
    if (c == '#') {  // Start of data
      bufferIndex = 0;
    } else if (c == '$') {  // End of data
      buffer[bufferIndex] = '\0';  // Null-terminate the string
      processPlantData();
      // Clear the buffer
      for (byte i = 0; i < bufferSize; i++) {
        buffer[i] = '\0';
      }
      // printData();
      numPlants > 0 ? Serial.println(String(xArray[0]) + " " + String(yArray[0])) : Serial.println("Nothing");
      clearData();
      bufferIndex = 0;
    } else if (bufferIndex < bufferSize - 1) {
      buffer[bufferIndex++] = c;
    }
  }
}


int findNextSpace(const char *str, int startIndex) {
  for (int i = startIndex; i < bufferIndex; i++) {
    if (str[i] == ' ') {
      return i;
    }
  }
  return -1;  // Space not found
}


void clearData(){
  
  for (byte i = 0; i < numPlants; i++) {
    idArray[i] = '\0';
    xArray[i] = '\0';
    yArray[i] = '\0';
  } 
}

void printData(){
  
  // Print processed arrays
  // Serial.println("Processed Data:");
  for (int i = 0; i < numPlants; i++) {
    Serial.print("Plant ");
    Serial.print(idArray[i]);
    Serial.print(": X = ");
    Serial.print(xArray[i]);
    Serial.print(", Y = ");
    Serial.println(yArray[i]);
  }
  Serial.println();
}



void setup() {
  Serial.begin(115200);
  // Serial2.begin(115200);  // Initialize Serial2 on UART port 2
  Serial.println("UART Data Processing Example");

  motor.setUpPin();
  setUpEncoder();

  pinMode(pinFwd, OUTPUT);
  pinMode(pinBwd, OUTPUT);
  pinMode(pinPWM, OUTPUT);
  ledcSetup(0, 5000, 8);
  ledcAttachPin(pinPWM, 0);

}



void loop() {
  updateEncoder();
  motor.speed(0.3);

}