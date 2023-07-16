import serial
ser = serial.Serial("COM3", 115200)
   
# Send character 'S' to start the program
ser.write(bytearray('S','ascii'))

# Read line   
while True:
    bs = ser.readline()
    print(bs)