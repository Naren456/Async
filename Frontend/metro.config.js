const { getDefaultConfig } = require("expo/metro-config");

const { withNativeWind } = require("nativewind/metro");


const config = getDefaultConfig(__dirname);

// Ensure web platform resolves .web.tsx before .tsx
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), "web.ts", "web.tsx"];

// Removed custom transformer override because it breaks NativeWind CSS extraction in release builds

module.exports = withNativeWind(config, { input: "./app/global.css" });