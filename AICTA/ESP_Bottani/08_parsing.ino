//#include <Arduino.h>
//
//const byte bufferSize = 100;  // Adjust this based on your data length
//char buffer[bufferSize];
//byte bufferIndex = 0;
//
//const int maxPlants = 10;  // Adjust this based on your needs
//int idArray[maxPlants];
//float xArray[maxPlants];
//float yArray[maxPlants];
//int numPlants = 0;
//
//
//void processPlantData() {
//  int plantCount;
//  int currentIndex = 0;  // Skip the '#' character
//  numPlants = 0;
////  Serial.println("Raw data: " + String(buffer));/
//  if (sscanf(buffer + currentIndex, "%d", &plantCount) == 1) {
//    currentIndex = findNextSpace(buffer, currentIndex);
//    for (int i = 0; i < plantCount && currentIndex != -1; i++) {
//      int id;
//      float x, y;
//      currentIndex = findNextSpace(buffer, currentIndex ); // Move past the space character
//      if (sscanf(buffer + currentIndex, "%d %f %f", &id, &x, &y) == 3) {
//        idArray[numPlants] = id;
//        xArray[numPlants] = x;
//        yArray[numPlants] = y;
//        numPlants++;
//        if (numPlants >= maxPlants) {
//          break;  // Limit reached
//        }
//      }
//      for(int i=0; i<3; i++){ 
//        currentIndex = findNextSpace(buffer, currentIndex+1);
//      }
//    }
//  }
//
//
//}
//
//
//int findNextSpace(const char *str, int startIndex) {
//  for (int i = startIndex; i < bufferIndex; i++) {
//    if (str[i] == ' ') {
//      return i;
//    }
//  }
//  return -1;  // Space not found
//}
//
//void clearData(){
//  
//  for (byte i = 0; i < numPlants; i++) {
//    idArray[i] = '\0';
//    xArray[i] = '\0';
//    yArray[i] = '\0';
//  } 
//}
//
//void printData(){
//  
//  // Print processed arrays
//  Serial.println("Processed Data:");
//  for (int i = 0; i < numPlants; i++) {
//    Serial.print("Plant ");
//    Serial.print(idArray[i]);
//    Serial.print(": X = ");
//    Serial.print(xArray[i]);
//    Serial.print(", Y = ");
//    Serial.println(yArray[i]);
//  }
//  Serial.println();
//}
//
//
//
//void getAndParseDataFromUART(){
//    if (Serial.available()) {  // Read from Serial
//    char c = Serial.read();
//    if (c == '#') {  // Start of data
//      bufferIndex = 0;
//    } else if (c == '$') {  // End of data
//      buffer[bufferIndex] = '\0';  // Null-terminate the string
//      processPlantData();
//      // Clear the buffer
//      for (byte i = 0; i < bufferSize; i++) {
//        buffer[i] = '\0';
//      }
//      printData();
//      clearData();
//      bufferIndex = 0;
//    } else if (bufferIndex < bufferSize - 1) {
//      buffer[bufferIndex++] = c;
//    }
//  }
//}
