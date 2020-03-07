module.exports = class LedProgram {
  lights = [];
  timing = 50;
  interval = 0;
  loop = null;
  forward = true;
  Gpio = require('onoff').Gpio;

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
    const programs = ['loop', 'bounce', 'tiptap', 'growShrink', 'progress', 'sos', 'flyBy'];

    if (programs.indexOf(programName) === -1) {
      throw {
        code: 1,
        message: `Invalid program name: ${programName}\n`
      };
    }

    programName = this[programName];

    this.initLights();
    this.loop = setInterval(programName, delay);
  }

  kill = () => {
    clearInterval(this.loop);

    this.lights.forEach(light => {
      light.gpio.writeSync(0);
      light.gpio.unexport();
    });

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("Cleaned up and finished\n");
  }

  all = () => {

  }

  loop = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Firing LED ${this.lights[this.interval].name}`);
    // process.stdout.write(`\nInterval: ${this.interval}\n`);

    // Turn off all LEDs
    this.lights.forEach(light => {
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
    this.lights.forEach(light => {
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

  tiptap = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Firing ${this.interval % 2 === 0 ? 'even' : 'odd'} LEDs`);
    process.stdout.write(`\nInterval: ${this.interval}\n`);

    for (let i = 0; i < this.lights.length; i++) {
      if ((i + this.interval) % 2 === 0) {
        this.lights[i].gpio.writeSync(1);
      } else {
        this.lights[i].gpio.writeSync(0);
      }
    }

    this.interval++;

    if (this.interval > 1) {
      this.interval = 0;
    }
  }

  growShrink = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Firing LED ${this.lights[this.interval].name}`);
    process.stdout.write(`\nInterval: ${this.interval}\n`);

    if (this.forward) {
      this.lights[this.interval].gpio.writeSync(1);
    } else {
      this.lights[this.interval].gpio.writeSync(0);
    }

    if (this.forward) {
      this.interval++;
    } else {
      this.interval--;
    }

    if (this.interval === this.lights.length - 1) {
      this.forward = false;
    } else if (this.interval === 0) {
      this.forward = true;
    }
  }

  progress = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Firing LED ${this.lights[this.interval].name}`);
    // process.stdout.write(`\nInterval: ${this.interval}\n`);

    this.lights[this.interval].gpio.writeSync(1);

    if (this.interval === this.lights.length - 1) {
      this.lights.forEach(light => {
        light.gpio.writeSync(0);
      });

      this.interval = 0;
    } else {
      this.interval++;
    }
  }

  sos = () => {
    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    // process.stdout.write(`Firing ${this.interval % 2 === 0 ? 'even' : 'odd'} LEDs`);
    // process.stdout.write(`\nInterval: ${this.interval}\n`);

    let fireIntervals = [0, 2, 4, 7, 8, 11, 12, 15, 16, 19, 21, 23]

    if (fireIntervals.includes(this.interval)) {
      this.lights.forEach(light => {
        light.gpio.writeSync(1);
      });
    } else {
      this.lights.forEach(light => {
        light.gpio.writeSync(0);
      });
    }

    this.interval++;

    if (this.interval > 25) {
      this.interval = 0;
    }
  }

  flyBy = () => {
    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    // process.stdout.write(`Firing ${this.interval % 2 === 0 ? 'even' : 'odd'} LEDs`);
    // process.stdout.write(`\nInterval: ${this.interval}\n`);
    
    if (this.interval < 8) {
      this.lights[this.interval].gpio.writeSync(1);
    } else if (this.interval >= 8 && this.interval < this.lights.length * 2) {
      this.lights[this.interval - this.lights.length].gpio.writeSync(0);
    }

    this.interval++;

    if (this.interval > this.lights.length * 5) {
      this.interval = 0;
    }
  }
}
