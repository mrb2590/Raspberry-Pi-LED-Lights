const Gpio = require('onoff').Gpio;
const lights = require('./lights-config.json');
const args = process.argv.slice(2);
const config = {
  timing: 50,
  function: backForth,
  flowDirection: 'up'
};
let interval = 0;

initLights();

const flowInterval = setInterval(config.function, config.timing);

process.on('SIGINT', unexportOnClose);

function initLights () {
  process.stdout.write('Initilizing lights...');

  lights.forEach(light => {
    light.gpio = new Gpio(light.pin, 'out');
  });

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write('Initilizing lights... Done\n');
}

function backForth () {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`Firing LED ${lights[interval % lights.length].name}`);

  // Turn off all LEDs
  lights.forEach(function (light) {
    light.gpio.writeSync(0);
  });

  // Set flow direction to "up" if the count reaches zero
  if (interval === 0) {
    config.flowDirection = 'up';
  }

  // Set flow direction to "down" if the count reaches 7
  if (interval >= lights.length) {
    config.flowDirection = 'down';
  }

  if (config.flowDirection == 'down') {
    interval--;
  }

  lights[interval].gpio.writeSync(1);

  if (config.flowDirection == "up") {
    interval++;
  }

  //console.log("\n"+interval)
};

function circle () {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`Firing LED ${lights[interval % lights.length].name}`);

  // Turn off all LEDs
  lights.forEach(function (light) {
    light.gpio.writeSync(0);
  });

  lights[interval%lights.length].gpio.writeSync(1);

  interval++;

  // Spin for three times
  if (interval > lights.length * 3) {
    // unexportOnClose();
  }

  // Reset the interval so it doesn't get too large
  if (interval % lights.length === 0) {
    interval = 0;
  }

  //console.log("\n"+interval)
};

// Clear loop and LEDs
function unexportOnClose() {
  clearInterval(flowInterval);

  lights.forEach(function (light) {
    light.gpio.writeSync(0);
    light.gpio.unexport();
  });

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write("Done\n");
};
