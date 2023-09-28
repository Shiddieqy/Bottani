import cv2
import numpy as np
import time
import requests
import pickle
# import serial


# Define the serial port and baud rate
# serial_port = '/dev/ttyTHS1'
# baud_rate = 115200


# Initialize the serial connection
# ser = serial.Serial(serial_port, baud_rate)



# serial_port = serial.Serial(
#     port="/dev/ttyTHS1",
#     baudrate=115200,
#     bytesize=serial.EIGHTBITS,
#     parity=serial.PARITY_NONE,
#     stopbits=serial.STOPBITS_ONE,
# )

# Wait a second to let the port initialize
# time.sleep(1)
import socket   
hostname=socket.gethostname()   
IPAddr=socket.gethostbyname(hostname)   

server_url = "http://{IPaddr}:3000/live".format(IPaddr=IPAddr)
print(server_url)
# server_url = "http://localhost:3000/live"

cv2.namedWindow("Track")
cv2.resizeWindow("Track",700,512)
threshold_area = 1000

def track(x):
    return x

# Get tracker data
file = open("tracker-data.txt", "rb")
trackerData = pickle.load(file)

h_min = trackerData["h_min"]
h_max = trackerData["h_max"]
s_min = trackerData["s_min"]
s_max = trackerData["s_max"]
v_min = trackerData["v_min"]
v_max = trackerData["v_max"]
a_min = trackerData["a_min"]
a_max = trackerData["a_max"]

cv2.createTrackbar('hue min', 'Track', h_min,179,track)
cv2.createTrackbar('hue max', 'Track', h_max,179,track)
cv2.createTrackbar('sat min', 'Track', s_min,255,track)
cv2.createTrackbar('sat max', 'Track', s_max,255,track)
cv2.createTrackbar('val min', 'Track', v_min,255,track)
cv2.createTrackbar('val max', 'Track', v_max,255,track)
cv2.createTrackbar('area min', 'Track', a_min,5000,track)
cv2.createTrackbar('area max', 'Track', a_max,50000,track)

cap = cv2.VideoCapture(0)
tracker = cv2.legacy.TrackerMOSSE_create()
# cap = cv2.VideoCapture("video.mp4")
width  = cap.get(3)   # float `width`
height = cap.get(4)
id_no = []
x_id = []
y_id = []
check_id = []
count_id = 0
identified = 0



def is_inside(x,y,xg,yg,wg,hg):
    if (x+width/2 > xg and x+width/2 <xg+wg and (-1*y+height/2) > yg and (-1*y+height/2) < yg+hg):
        return True
    else :
        return False
    
while (1):
    _,frame = cap.read() 
    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    h_min = cv2.getTrackbarPos('hue min', 'Track')
    h_max = cv2.getTrackbarPos('hue max', 'Track')
    s_min = cv2.getTrackbarPos('sat min', 'Track')
    s_max = cv2.getTrackbarPos('sat max', 'Track')
    v_min = cv2.getTrackbarPos('val min', 'Track')
    v_max = cv2.getTrackbarPos('val max', 'Track')
    a_min = cv2.getTrackbarPos("area min", 'Track')
    a_max = cv2.getTrackbarPos("area max", 'Track')
    trackerData = {
        "h_min" : h_min,
        "h_max" : h_max,
        "s_min" : s_min,
        "s_max" : s_max,
        "v_min" : v_min,
        "v_max" : v_max,
        "a_min" : a_min,
        "a_max" : a_max
    }
    file = open("tracker-data.txt","wb")
    pickle.dump(trackerData ,file)
    file.close()

    #mask
    # lower = np.array([h_min, s_min, v_min])
    # upper = np.array([h_max,s_max,v_max])
    #mask green
    lower = np.array([27, 86, 58])
    upper = np.array([93,210,231])
    mask = cv2.inRange(hsv_frame, lower,upper)


    cn= cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[-2]

    # Setiap contour yang terdetect alias setiap tanaman yang terdetect
    for i in cn:
        # area = max(cn,key = cv2.contourArea)

        area = cv2.contourArea(i)        
        # Luas contour harus lebih besar daripada sekian biar dianggap tanaman 
        if area > threshold_area: 
            (xg,yg,wg,hg)=cv2.boundingRect(i)
            cv2.rectangle(frame,(xg,yg),(xg+wg,yg+hg),(0,255,0),3)
            xcord = xg+wg/2-width/2
            ycord = -1*(yg+hg/2-height/2)
            # print("x : ",xcord, "y : ",ycord)
            # print(xg,yg,wg,hg)

            # Kalau bukan tanaman pertama
            if (len(id_no)>0):
                identified = 0
                for j in range(len(id_no) and ycord > -height/4) :
                    if (is_inside(x_id[j],y_id[j],xg,yg,wg,hg)):
                        x_id[j] = xcord
                        y_id[j] = ycord
                        identified = 1
                        check_id[j] = 1
                        cv2.putText(frame, str(id_no[j]), (xg,yg-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)
                        break

            # Not identified tapi ada di pinggir frame kamera, jadi pasti baru  
            if(((not identified or len(id_no) == 0) and (xg == 0 or xg+wg == width or yg == 0 or yg+hg == height)) or count_id == 0 and ycord > -height/4):
                count_id += 1
                id_no.append(count_id)
                check_id.append(1)
                x_id.append(xcord)
                y_id.append(ycord)
                cv2.putText(frame, str(count_id), (xg,yg-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)
            # Not identified, berada di tengah frame,dan pasti punya tetangga
            elif (not identified and len(id_no) > 0 and ycord > -height/4):
                # Sisi miring frame kamera
                rmax = (width*width + height*height)
                identity = 0

                for k in range(len(id_no)):
                    # Jarak tanaman yang mau dikasih id dengan tanaman yang sudah di kasih id sebelumnya
                    rvalue = (xcord - x_id[k])**2 +(ycord - y_id[k])**2
                    # Mencari id (identity) jarak tanaman yang paling dekat dengan tanaman yang mau di kasih id (rvalue)
                    if(rvalue < rmax):
                        rmax = rvalue
                        identity = k
                
                # Check id = apakah id ini sudah di identified atau belum, check id adalah array of bool (1 = udah pernah, 0 = belom)
                if (check_id[identity]==0  ):
                    x_id[identity] = xcord
                    y_id[identity] = ycord
                    identified = 1
                    check_id[identity] = 1
                    cv2.putText(frame, str(id_no[identity]), (xg,yg-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)
            
            


    # reset semua setelah satu frame, hapus id yang udah ga kebaca lagi
    for l in range(len(id_no)-1,-1,-1):
        if (check_id[l]==0):
            check_id.pop(l)
            id_no.pop(l)
            x_id.pop(l)
            y_id.pop(l)
        else :
            check_id[l] = 0
            
    cv2.drawMarker(frame, (int(width/2), int(height/2)),  (0, 0, 255), cv2.MARKER_CROSS, 10, 1)
    
    message = "#" + str(len(id_no)) + " "
    for id, x, y in zip(id_no, x_id, y_id):
        message += str(id) + " " + str(x) + " " + str(y) + " "
    message += "$"
    
    # ser.write(message.encode())
    print(f"Sent: {message}")

    # cv2.imshow('ori',frame)
    _, encoded_frame = cv2.imencode('.jpg', frame)

    response = requests.post(server_url, data=encoded_frame.tobytes(), headers={'Content-Type': 'image/jpeg'})
    if response.status_code == 200:
        print(response.text)
    else:
        print('Failed to send data')
    
    cv2.imshow('hsv',mask)
    
    if cv2.waitKey(1) %0xFF == ord('q'):
        break