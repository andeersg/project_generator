const headline = (text, level = 1) => {
  return '#'.repeat(level) + ' ' + text + '\n';
};

const readmeGenerator = (config) => {
  let output = headline('Just another Drupal project');
  output += ``;
};

module.exports = readmeGenerator;