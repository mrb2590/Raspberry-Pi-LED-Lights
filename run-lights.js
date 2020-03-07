const LedProgram = require('./LedProgram.js');
const args = process.argv.slice(2);
const allowedArgs = ['program', 'circle'];
const config = {
  program: 'circle',
  timing: 50
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

light.run(config.program, config.timing);
