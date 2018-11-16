const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const led10 = new Gpio(10, 'out'); //use GPIO pin 10 as output
const led12 = new Gpio(12, 'out'); //use GPIO pin 12 as output
const led13 = new Gpio(13, 'out'); //use GPIO pin 13 as output
const led14 = new Gpio(14, 'out'); //use GPIO pin 14 as output
const led15 = new Gpio(15, 'out'); //use GPIO pin 15 as output
const led16 = new Gpio(16, 'out'); //use GPIO pin 16 as output
const led17 = new Gpio(17, 'out'); //use GPIO pin 17 as output
const led18 = new Gpio(18, 'out'); //use GPIO pin 18 as output
const led19 = new Gpio(19, 'out'); //use GPIO pin 19 as output
const led21 = new Gpio(21, 'out'); //use GPIO pin 21 as output
const led24 = new Gpio(24, 'out'); //use GPIO pin 24 as output
const led26 = new Gpio(26, 'out'); //use GPIO pin 26 as output
const sunButton = new Gpio(2, 'in', 'both'); //use GPIO pin 2 as input, and 'both' button presses, and releases should be handled
const cloudButton = new Gpio(8, 'in', 'both'); //use GPIO pin 2 as input, and 'both' button presses, and releases should be handled
const switchLeds = (trigger, value, ...leds) => {
    let innerTrigger;

    for (let item of leds){
        innerTrigger = trigger;
        if (value && !innerTrigger){
            innerTrigger = 1;
            item.writeSync(1);//turn LED on;
        } else if (!value && innerTrigger === 1) {
            innerTrigger = 2;
        } else if (innerTrigger === 2) {
            innerTrigger = 0;
            item.writeSync(0);//turn LED on;
        } 
    };

    return innerTrigger;
}; 
const unexportLedsOnClose = (leds) => { //function to run when exiting program
    for (let led of leds){
        led.writeSync(0); // Turn LED off
        led.unexport(); // Unexport LED GPIO to free resources
    }
};
const unexportBtnsOnClose = (btns) => { //function to run when exiting program
    for (let btn of btns){
        btn.unexport(); // Unexport Button GPIO to free resources
    }
};
const unexportOnClose = (btns, leds) => {
    unexportLedsOnClose(leds);
    unexportBtnsOnClose(btns);
};
let sunTrigger = 0;
let cloudTrigger = 0;

sunButton.watch(function (err, value) { //Watch for hardware interrupts on sunButton GPIO, specify callback function
    if (err) {
        console.error('There was an error', err); //output error message to console
        return;
    }

    sunTrigger = switchLeds(sunTrigger, value ,led13, led16, led19);
});

cloudButton.watch(function (err, value) { //Watch for hardware interrupts on cloudButton GPIO, specify callback function
    if (err) {
        console.error('There was an error', err); //output error message to console
        return;
    }

    cloudTrigger = switchLeds(cloudTrigger, value , led10, led12, led14, led15, led17, led18, led21, led24, led26);
});

process.on('SIGINT', unexportOnClose.bind(this,[sunButton,cloudButton],[led10, led12, led13, led14, led15, led16, led17, led18, led19, led21, led24, led26])); //function to run when user closes using ctrl+c
