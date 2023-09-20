
float temperature;
float humidity;
float moisture;

void notify()
{
    //--- Digital cross/square/triangle/circle button events ---
    if( Ps3.event.button_down.cross )
        button_s_down = 1;
    if( Ps3.event.button_up.cross )
        button_s_down = 0;

    if( Ps3.event.button_down.square )
        button_s_left = 1;
    if( Ps3.event.button_up.square )
        button_s_left = 0;

    if( Ps3.event.button_down.triangle )
        button_s_up = 1;
    if( Ps3.event.button_up.triangle )
        button_s_up = 0;

    if( Ps3.event.button_down.circle )
        button_s_right = 1;
    if( Ps3.event.button_up.circle )
        button_s_right = 0;

    //--------------- Digital D-pad button events --------------
    if( Ps3.event.button_down.up )
        button_up = 1;
    if( Ps3.event.button_up.up )
        button_up = 0;

    if( Ps3.event.button_down.right )
        button_right = 1;
    if( Ps3.event.button_up.right )
        button_right = 0;

    if( Ps3.event.button_down.down )
        button_down = 1;
    if( Ps3.event.button_up.down )
        button_down = 0;

    if( Ps3.event.button_down.left )
        button_left = 1;
    if( Ps3.event.button_up.left )
        button_left = 0;

    //------------- Digital shoulder button events -------------
    if( Ps3.event.button_down.l1 )
        button_s_spray = 1;
    if( Ps3.event.button_up.l1 )
        button_s_spray = 0;

//    if( Ps3.event.button_down.r1 )
//        Serial.println("Started pressing the right shoulder button");
//    if( Ps3.event.button_up.r1 )
//        Serial.println("Released the right shoulder button");
//
//    //-------------- Digital trigger button events -------------
//    if( Ps3.event.button_down.l2 )
//        Serial.println("Started pressing the left trigger button");
//    if( Ps3.event.button_up.l2 )
//        Serial.println("Released the left trigger button");
//
//    if( Ps3.event.button_down.r2 )
//        Serial.println("Started pressing the right trigger button");
//    if( Ps3.event.button_up.r2 )
//        Serial.println("Released the right trigger button");
//
//    //--------------- Digital stick button events --------------
//    if( Ps3.event.button_down.l3 )
//        Serial.println("Started pressing the left stick button");
//    if( Ps3.event.button_up.l3 )
//        Serial.println("Released the left stick button");
//
//    if( Ps3.event.button_down.r3 )
//        Serial.println("Started pressing the right stick button");
//    if( Ps3.event.button_up.r3 )
//        Serial.println("Released the right stick button");
//
//    //---------- Digital select/start/ps button events ---------
//    if( Ps3.event.button_down.select )
//        Serial.println("Started pressing the select button");
//    if( Ps3.event.button_up.select )
//        Serial.println("Released the select button");
//
//    if( Ps3.event.button_down.start )
//        Serial.println("Started pressing the start button");
//    if( Ps3.event.button_up.start )
//        Serial.println("Released the start button");
//
//    if( Ps3.event.button_down.ps )
//        Serial.println("Started pressing the Playstation button");
//    if( Ps3.event.button_up.ps )
//        Serial.println("Released the Playstation button");
//
//
//    //---------------- Analog stick value events ---------------
//   if( abs(Ps3.event.analog_changed.stick.lx) + abs(Ps3.event.analog_changed.stick.ly) > 2 ){
//       Serial.print("Moved the left stick:");
//       Serial.print(" x="); Serial.print(Ps3.data.analog.stick.lx, DEC);
//       Serial.print(" y="); Serial.print(Ps3.data.analog.stick.ly, DEC);
//       Serial.println();
//    }
//
//   if( abs(Ps3.event.analog_changed.stick.rx) + abs(Ps3.event.analog_changed.stick.ry) > 2 ){
//       Serial.print("Moved the right stick:");
//       Serial.print(" x="); Serial.print(Ps3.data.analog.stick.rx, DEC);
//       Serial.print(" y="); Serial.print(Ps3.data.analog.stick.ry, DEC);
//       Serial.println();
//   }
//
//
//
//   //---------------------- Battery events ---------------------
//    if( battery != Ps3.data.status.battery ){
//        battery = Ps3.data.status.battery;
//        Serial.print("The controller battery is ");
//        if( battery == ps3_status_battery_charging )      Serial.println("charging");
//        else if( battery == ps3_status_battery_full )     Serial.println("FULL");
//        else if( battery == ps3_status_battery_high )     Serial.println("HIGH");
//        else if( battery == ps3_status_battery_low)       Serial.println("LOW");
//        else if( battery == ps3_status_battery_dying )    Serial.println("DYING");
//        else if( battery == ps3_status_battery_shutdown ) Serial.println("SHUTDOWN");
//        else Serial.println("UNDEFINED");
//    }
//      sampling_track();
//      sampling_spray();

}

void onConnect(){
    Serial.println("Connected.");
}

//void sampling_sensor(){
//  temperature = 20.5+random(1,100)*1.0/20;
//  humidity = 20.5+random(1,100)*1.0/20;
//  moisture = 20.5+random(1,100)*1.0/20;
//  publish_float(temperature,T_TOPIC);
//  publish_float(humidity,H_TOPIC);
//  publish_float(moisture,M_TOPIC);
//}
