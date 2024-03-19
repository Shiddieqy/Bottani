#define BUTTON_TOPIC "cmd/button"
bool button_up;
bool button_down;
bool button_right;
bool button_left;
bool button_s_up;
bool button_s_down;
bool button_s_right;
bool button_s_left;
bool button_s_spray;
int player = 2;
int addition = 1;
int setpoint = 0;
int xpwm = 0;
int currpulse = 0;
int is_auto = 0;
int is_manual = 1;
int sensor_motor = 0;
int sensor_motordown = 0;
unsigned long sensor_timer = millis();
unsigned long button_timer = millis();
unsigned long auto_timer = millis();
enum spray_state{MID, RIGHT, LEFT, RESET, SPRAYING,END};
int spray_sequence[] = {MID, LEFT, SPRAYING, RIGHT, SPRAYING, MID,END} ;
int current_sequence = 0;
bool encoder_ready = 0;



int btn;
