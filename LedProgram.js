module.exports = class LedProgram {
  lights = [];
  timing = 50;
  interval = 0;
  loop = null;
  forward = true;
  Gpio = require('onoff').Gpio;

  constructor () {
    this.initLights();
  }

  initLights = () => {
    process.stdout.write('Initilizing lights...');

    this.lights = require('./lights-config.json');

    this.lights.forEach(light => {
      light.gpio = new this.Gpio(light.pin, 'out');
    });

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Initilizing lights... Done\n');
  }

  run = (programName, delay) => {
    switch (programName) {
      case 'loop':
        programName = this.loop;
        break;
      case 'bounce':
        programName = this.bounce;
        break;
      default:
        throw 'Incorrect program name.';
    }

    this.loop = setInterval(programName, delay);
  }

  kill = () => {
    clearInterval(this.loop);

    this.lights.forEach(function (light) {
      light.gpio.writeSync(0);
      light.gpio.unexport();
    });

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("Done\n");
  }

  loop = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Firing LED ${this.lights[this.interval].name}`);
    // process.stdout.write(`\nInterval: ${this.interval}\n`);

    // Turn off all LEDs
    this.lights.forEach(function (light) {
      light.gpio.writeSync(0);
    });

    this.lights[this.interval].gpio.writeSync(1);

    this.interval++;

    // Spin for three times
    if (this.interval > this.lights.length * 3) {
      // unexportOnClose();
    }

    // Reset the interval so it doesn't get too large
    if (this.interval % this.lights.length === 0) {
      this.interval = 0;
    }
  }

  bounce = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Firing LED ${this.lights[this.interval].name}`);
    // process.stdout.write(`\nInterval: ${this.interval}\n`);

    // Turn off all LEDs
    this.lights.forEach(function (light) {
      light.gpio.writeSync(0);
    });

    this.lights[this.interval].gpio.writeSync(1);

    if (this.interval <= 0) {
      this.forward = true;
    } else if (this.interval >= this.lights.length - 1) {
      this.forward = false;
    }

    if (this.forward) {
      this.interval++;
    } else {
      this.interval--;
    }
  }
}
