const path = require('node:path');
const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const fg = require('fast-glob');

const _loadTemplates = async () => {
  const templates = {};
  
  const tpl_paths = await fg('templates/*.tpl', {cwd: __dirname});
  for (let tpl of tpl_paths) {
    const pathInfo = path.parse(tpl);
    const content = await fs.readFile(path.resolve(__dirname, tpl), 'utf-8');
    templates[pathInfo.name] = nunjucks.compile(content);
  }

  return templates;
};

// Memoized function for loading and rendering templates.
const renderTemplate = async () => {
  const templates = await _loadTemplates();

  return async (key, values = {}) => {
    if (typeof templates[key] == 'undefined') {
      throw new Error('Unknown template requested: ' + key);
    }
    return templates[key].render(values);
  };
};

const createRancherFiles = async (config) => {
  const renderer = await renderTemplate();

  let trusted_host_pattern = config.sections.rancher.domain;
  trusted_host_pattern = trusted_host_pattern.replace(/\./g, '\.');
  trusted_host_pattern = `^${trusted_host_pattern}$`;
  
  await fs.outputFile('fleet/settings.local.php', await renderer('rancher_settings_php', {trusted_host_pattern}), 'utf-8');
  await fs.outputFile('fleet/main/fleet.yaml', await renderer('fleet_yaml'), 'utf-8');
  await fs.outputFile('fleet/main/rancher_values.yaml', await renderer('rancher_values_yaml', config), 'utf-8');
};

module.exports = {
  createRancherFiles,
  renderTemplate,
};