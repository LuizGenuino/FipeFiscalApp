const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@assets': path.resolve(__dirname, './assets'),
  '@': path.resolve(__dirname, './src'),
};

config.resolver.assetExts.push('png', 'jpg', 'jpeg');

module.exports = config;