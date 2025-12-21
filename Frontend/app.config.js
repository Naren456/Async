import 'dotenv/config'

export default {"expo": {
    "name": "ASync",
    "slug": "A_Sync",
    "version": "1.0.0",
    "updates": {
      "url": "https://u.expo.dev/ad21c5dd-0135-4666-b260-2da9d68c9ec2"
    },
    "runtimeVersion": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "async",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,

    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.async.mobile",
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },

    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/adaptive-icon.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.android.async",
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "android.permission.INTERNET"
      ]
    },

    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },

    "plugins": [
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
          "webClientId": process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
          "iosUrlScheme": process.env.EXPO_PUBLIC_IOS_URL_SCHEME
        }
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "ndkVersion": "27.1.12297006"
          }
        }
      ]
    ],

    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },

    "extra": {
      "router": {},
      "googleWebClientId": process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      "eas": {
        "projectId": "ad21c5dd-0135-4666-b260-2da9d68c9ec2"
      }
    }
  }
}

