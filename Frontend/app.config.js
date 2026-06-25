import 'dotenv/config';

export default {
  name: "ASync",
  slug: "A_Sync",
  owner: "narendra78",
  version: "1.0.0",
  runtimeVersion: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "async",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.async.mobile",
    googleServicesFile: "./GoogleService-Info.plist",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },

  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/adaptive-icon.png"
    },
    // edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.narendra.async",
    googleServicesFile: "./google-services.json"
  },

  web: {
    output: "static",
    favicon: "./assets/images/favicon.png"
  },

  updates: {
    url: "https://u.expo.dev/b3509111-0a7b-477c-8027-881177af28de"
  },

  plugins: [
    "expo-asset",
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon-light.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "image": "./assets/images/splash-icon-dark.png",
          "backgroundColor": "#000000"
        }
      }
    ],
    [
      "expo-notifications",
      {
        "color": "#ffffff",
        "defaultChannel": "default",
        "enableBackgroundRemoteNotifications": false
      }
    ],
    "expo-web-browser",
    "expo-secure-store",
    [
      "@react-native-google-signin/google-signin",
      {
        "webClientId": process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        "iosUrlScheme": process.env.EXPO_PUBLIC_IOS_URL_SCHEME
      }
    ],
    [
      "expo-build-properties",
      {
        "android": {
          "ndkVersion": "27.1.12297006",
          "usesCleartextTraffic": true
        },
        "ios": {
          "useFrameworks": "static"
        }
      }
    ]
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true
  },

  extra: {
    router: {},
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    eas: {
      projectId: "b3509111-0a7b-477c-8027-881177af28de"
    }
  }
};