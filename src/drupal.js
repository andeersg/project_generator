const fs = require('fs-extra');
const { executeShellCommand } = require('./shell');
const filesystem = require('./filesystem');

const siteInstall = async () => {
  // Run drush command to set up database.
};

/**
 * Prepare the settings.php for ddev and settings.local.php
 */
const modifySettingsphp = async (content) => {
  const lines = Array.from(content.split('\n')).reverse();
  let i = 0;
  for (let line of lines) {
    if (i < 8) {
      if (line.startsWith('#') && line.endsWith('#')) {
        lines[i] = '';
      }
      else if (line.startsWith('#')) {
        lines[i] = line.replace('# ', '');
      }
    }
    else {
      break;
    }
    i++;
  }

  return lines.reverse().join('\n');
};

const modifyGitignore = async (content) => {
  content = content.replace(/\n\/web\/sites\/\*\/settings\.php/, '');

  content += '\n\n# Misc';
  content += '\n*.sql';
  content += '\nnode_modules/';
  content += '\n/web/sites/*/settings.ddev.php'; // Generated by ddev.
  content += '\n';

  return content;
};

/**
 * Make improvements to composer.json.
 */
const modifyComposerjson = async () => {
  const composerJson = await filesystem.loadJson('composer.json');

  composerJson.extra['drupal-scaffold']['file-mapping'] = {
    "[web-root]/web.config": false,
    "[web-root]/sites/development.services.yml": false,
  };
  await filesystem.writeJson('composer.json', composerJson);
};

const modifyFiles = async () => {
  let gitIgnore = await fs.readFile('.gitignore', { encoding: 'utf8' });
  gitIgnore = await modifyGitignore(gitIgnore);
  await fs.writeFile('.gitignore', gitIgnore);

  let settingsPhp = await fs.readFile('web/sites/default/settings.php', { encoding: 'utf8' });
  settingsPhp = await modifySettingsphp(settingsPhp);
  await fs.writeFile('web/sites/default/settings.php', settingsPhp);

  await modifyComposerjson();
};

module.exports = {
  siteInstall,
  modifyFiles,
  modifySettingsphp,
  modifyGitignore,
};
