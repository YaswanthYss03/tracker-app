// Metro config: Expo defaults + ignore native build output, so the file
// watcher doesn't run out of watches (ENOSPC) after a local Android build.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const ignore = [/[/\\]android[/\\]build[/\\].*/, /[/\\]android[/\\]\.cxx[/\\].*/, /[/\\]android[/\\]\.gradle[/\\].*/, /[/\\]ios[/\\]build[/\\].*/, /[/\\]ios[/\\]Pods[/\\].*/];
const existing = config.resolver.blockList;
config.resolver.blockList = [...(Array.isArray(existing) ? existing : existing ? [existing] : []), ...ignore];

module.exports = config;
