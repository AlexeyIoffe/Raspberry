const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const gpioNum = parseInt(process.argv[2]) || 21;  
const LED = new Gpio(gpioNum, 'out'); //use GPIO pin , and specify that it is output

if (process.argv[3] === 'on' && LED.readSync() ===0){
		console.log(`pin ${gpioNum} turned on`);
		LED.writeSync(1);
} else if (process.argv[3] === 'on' && LED.readSync() === 1) {
		console.log(`pin ${gpioNum} has bin already turned on`);
}  else if (process.argv[3] === 'off' && LED.readSync() === 1) {
		console.log(`pin ${gpioNum} turned off`);
		LED.writeSync(0);
}  else if (process.argv[3] === 'off' && LED.readSync() === 0) {
		console.log(`pin ${gpioNum} has bin already turned off`);
} 

setTimeout(() => {
		console.log('clearing resources');
		LED.unexport();
}, 5000);



