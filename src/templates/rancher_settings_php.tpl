<?php
// The settings.local.php for Rancher.
// @codingStandardsIgnoreFile
  
$databases['default']['default'] = array (
  'database' => getenv('DRUPAL_DATABASE_NAME'),
  'username' => getenv('DRUPAL_DATABASE_USER'),
  'password' => getenv('DRUPAL_DATABASE_PASSWORD'),
  'prefix' => '',
  'host' => getenv('DRUPAL_DATABASE_HOST'),
  'port' => getenv('DRUPAL_DATABASE_PORT_NUMBER'),
  'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
  'driver' => 'mysql',
);
  
$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT');
  
$settings['trusted_host_patterns'][] = '{{ trusted_host_pattern }}';
  
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;
  
if (getenv('DEVELOPMENT_MODE')) {
  $settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';
  $settings['cache']['bins']['render'] = 'cache.backend.null';
  $settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
  $config['system.performance']['css']['preprocess'] = FALSE;
  $config['system.performance']['js']['preprocess'] = FALSE;
  $config['advagg.settings']['enabled'] = FALSE;
}

$settings['reverse_proxy'] = TRUE;
$settings['reverse_proxy_addresses'] = array($_SERVER['REMOTE_ADDR']);
