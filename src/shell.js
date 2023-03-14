const child_process = require('child_process');

function run_script(command, args, silent) {
  let stdout_data = '';
  let stderr_data = '';
  let default_code = -1;

  return new Promise((resolve, reject) => {
    var child = child_process.spawn(command, args, {
      ...process.env,
      COMPOSER_PROCESS_TIMEOUT: '600',
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
      data = data.toString();
      stdout_data += data + '\n';
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
      data = data.toString();
      if (!silent) {
        process.stdout.write(data);
      }
      stderr_data += data + '\n';
    });

    child.on('close', function(code) {
      resolve({
        stdout: stdout_data,
        stderr: stderr_data,
        code,
      });
    });
  });
}

const executeShellCommand = async (command, silent = false) => {
  const [cmd, ...args] = command.split(' ');
  try {
    const {code} = await run_script(cmd, args, silent);
    return code;
  }
  catch (error) {
    return 1;
  }
};




module.exports = {
  executeShellCommand,
};