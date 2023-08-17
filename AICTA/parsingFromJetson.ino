void setup() {
  Serial.begin(115200); // Initialize the default Serial UART (UART0)
  Serial2.begin(115200, SERIAL_8N1, 16, 17); // Initialize UART2 at 115200 baud rate, pins 16 (RX2) and 17 (TX2)
}

void loop() {
  if (Serial2.available()) {
    String receivedChar = Serial2.readString();
    Serial.print("Received: ");
    Serial.println(receivedChar);
  }
}
