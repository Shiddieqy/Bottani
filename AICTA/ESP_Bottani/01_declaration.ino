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
unsigned long sensor_timer = millis();
unsigned long button_timer = millis();


int btn;
