const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add your customizations here

  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }

  config.resolve.fallback.crypto = require.resolve('crypto-browserify');
  config.resolve.fallback.buffer = require.resolve('buffer/');
  config.resolve.fallback.stream = require.resolve('stream-browserify');

  return config;
};
