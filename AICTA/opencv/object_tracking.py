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
            xcord = xg+wg/2-width/2
            ycord = -1*(yg+hg/2-height/2)
            # print("x : ",xcord, "y : ",ycord)
            # print(xg,yg,wg,hg)
            if (len(id_no)>0):
                identified = 0
                for i in range(len(id_no)) :
                    if (is_inside(x_id[i],y_id[i],xg,yg,wg,hg)):
                        x_id[i] = xcord
                        y_id[i] = ycord
                        identified = 1
                        check_id[i] = 1
                        cv2.putText(frame, str(id_no[i]), (xg,yg-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)
                        break
                    
            if(((not identified or len(id_no) == 0) and (xg == 0 or xg+wg == width or yg == 0 or yg+hg == height)) or count_id == 0):
                count_id += 1
                id_no.append(count_id)
                check_id.append(1)
                x_id.append(xcord)
                y_id.append(ycord)
                cv2.putText(frame, str(count_id), (xg,yg-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)
            if (not identified):
                rmax = (width*width + height*height)
                identity = 0
                for i in range(len(id_no)):
                    rvalue = (xcord - x_id[i])**2 +(ycord - y_id[i])**2
                    if(check_id==0 and rvalue < rmax):
                        rmax = rvalue
                        identity = i
                

                x_id[identity] = xcord
                y_id[identity] = ycord
                identified = 1
                check_id[identity] = 1
                cv2.putText(frame, str(id_no[identity]), (xg,yg-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)
            
            



    for i in range(len(id_no)-1,-1,-1):
        if (check_id[i]==0):
            check_id.pop(i)
            id_no.pop(i)
            x_id.pop(i)
            y_id.pop(i)
        else :
            check_id[i] = 0
            
            
            

    
            
    cv2.drawMarker(frame, (int(width/2), int(height/2)),  (0, 0, 255), cv2.MARKER_CROSS, 10, 1);

    print(id_no)

    cv2.imshow('ori',frame)
    cv2.imshow('hsv',mask)
    
    if cv2.waitKey(1) %0xFF == ord('q'):
        break