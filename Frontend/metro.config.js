const { getDefaultConfig } = require("expo/metro-config");

const { withNativeWind } = require("nativewind/metro");


const config = getDefaultConfig(__dirname);

// Removed custom transformer override because it breaks NativeWind CSS extraction in release builds

module.exports = withNativeWind(config, { input: "./app/global.css" });