const ora = require('ora');

const composer = require('./src/composer');
const filesystem = require('./src/filesystem');
const drupal = require('./src/drupal');
const templates = require('./src/templates');

// @TODO Clean up main file
// @TODO Site install
// @TODO Pack as zip

(async () => {
  // Set up spinner:
  console.log('Initiating project builder');

  const config = await filesystem.loadConfig();
  if (config === false) {
    console.log('Missing or malformed config, did you forget to mount it?');
    process.exit(1);
  }

  console.log('Installing Drupal project');
  await composer.createProject('build');

  // Move into the project.
  process.chdir('build');

  console.log('Installing Drupal modules');
  await composer.installModules(config.packages);

  await filesystem.createFolder('config/sync');

  // Modify different files like settings.php, gitignore++
  console.log('Modifying files');
  await drupal.modifyFiles();

  // Scaffold theme and rancher files.
  if (config.sections?.rancher?.enabled) {
    await templates.createRancherFiles(config);
  }

  // Install site with drush
  // Add ddev config
  // export database
  // git init and commit initial

  console.log('Copying files to output folder');
  
  await filesystem.cleanup();
  
  await filesystem.archive(config.machine_name);

  console.log('Project ready, good bye');
})();
