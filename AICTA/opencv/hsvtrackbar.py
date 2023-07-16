import cv2
import numpy as np
cv2.namedWindow("Track")
cv2.resizeWindow("Track",700,512)
threshold_area = 1000

def track(x):
    return x

cv2.createTrackbar('hue min', 'Track', 0,179,track)
cv2.createTrackbar('hue max', 'Track', 179,179,track)
cv2.createTrackbar('sat min', 'Track', 0,255,track)
cv2.createTrackbar('sat max', 'Track', 255,255,track)
cv2.createTrackbar('val min', 'Track', 0,255,track)
cv2.createTrackbar('val max', 'Track', 255,255,track)
cap = cv2.VideoCapture(0)
# cap = cv2.VideoCapture("video.mp4")

while (1):
    
    _,frame = cap.read() 
    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    h_min = cv2.getTrackbarPos('hue min', 'Track')
    h_max = cv2.getTrackbarPos('hue max', 'Track')
    s_min = cv2.getTrackbarPos('sat min', 'Track')
    s_max = cv2.getTrackbarPos('sat max', 'Track')
    v_min = cv2.getTrackbarPos('val min', 'Track')
    v_max = cv2.getTrackbarPos('val max', 'Track')


    #mask
    # lower = np.array([h_min, s_min, v_min])
    # upper = np.array([h_max,s_max,v_max])
    #mask green
    lower = np.array([27, 86, 58])
    upper = np.array([93,210,231])
    mask = cv2.inRange(hsv_frame, lower,upper)


    cn= cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)[-2]
    for i in cn:
        # area = max(cn,key = cv2.contourArea)
        area = cv2.contourArea(i)         
        if area > threshold_area: 
            (xg,yg,wg,hg)=cv2.boundingRect(i)
            cv2.rectangle(frame,(xg,yg),(xg+wg,yg+hg),(0,255,0),3)
            print("x : ",xg, "y : ",yg)

    cv2.imshow('ori',frame)
    cv2.imshow('hsv',mask)
    
    if cv2.waitKey(1) %0xFF == ord('q'):
        break