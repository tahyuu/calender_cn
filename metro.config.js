// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.nodeModulesPaths = [__dirname];

module.exports = config;
