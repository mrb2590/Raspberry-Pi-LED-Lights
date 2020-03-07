const LedProgram = require('./LedProgram.js');
const args = process.argv.slice(2);
const config = {
  program: 'loop',
  timing: 100
};

// Validate arguments
args.forEach(arg => {
  if (!arg.includes('=') || !arg.includes('--')) {
    process.stdout.write(`Invalid argument: ${arg}\n`);
    process.exit(1);
  }

  let parts = arg.split('=');
  let configName = parts[0].replace('--', '');
  let configValue = parts[1];

  if (typeof config[configName] === 'undefined') {
    process.stdout.write(`Invalid configuration name: ${configName}\n`);
    process.exit(1);
  }

  config[configName] = configValue;
});

let light = new LedProgram;

process.on('SIGINT', light.kill);

try {
  light.run(config.program, config.timing);
} catch (error) {
  if (typeof error.message !== 'undefined') {
    process.stdout.write(error.message);
  } else {
    process.stdout.write('Encountered error.');
  }
}
