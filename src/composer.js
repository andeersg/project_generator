const { executeShellCommand } = require('./shell');

const createProject = async (name) => {
  await executeShellCommand('composer clearcache', true);
  await executeShellCommand(`composer create-project drupal-composer/drupal-project:10.x-dev ${name} --no-interaction`, true);
};

const installModules = async (moduleList) => {
  for (let pkg of moduleList) {
    await requirePackage(pkg);
  }
};

const requirePackage = async (name, dev = false) => {
  await executeShellCommand(`composer require${dev ? ' --dev' : ''} ${name}`, true);
};

module.exports = {
  createProject,
  installModules,
  requirePackage,
}