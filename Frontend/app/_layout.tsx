import { Stack, SplashScreen } from "expo-router";
import "./global.css";
import { Provider } from 'react-redux';
import { store } from '../store/store';
import * as SecureStore from "expo-secure-store"
import { useDispatch } from "react-redux";


import { usePushNotifications } from "../hooks/usePushNotifications";
import { useSelector } from "react-redux";
import { UpdatePushToken } from "../api/apiCall";


import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Prevent auto hide
// Prevent auto hide
SplashScreen.preventAutoHideAsync();

function AppLayout() {

  const { expoPushToken } = usePushNotifications();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    // Hide the splash screen once the layout is mounted
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (user && user.token && expoPushToken) {
      UpdatePushToken(expoPushToken).catch(err => console.error("Failed to sync push token", err));
    }
  }, [user, expoPushToken]);

  useEffect(() => {
    try {
      const config = {
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "271566804440-u7gm5a3lo29kdguq069quflptm67nrdc.apps.googleusercontent.com",
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || "271566804440-6vv0ibjg7iagif6alqq20in544vt1dqs.apps.googleusercontent.com",
        offlineAccess: false,
      };
      console.log("DEBUG: Final Google Sign-In Config (Simplified):", JSON.stringify(config, null, 2));
      GoogleSignin.configure(config);
      console.log("Google Sign-In configured successfully");
    } catch (error) {
      console.error("Google Sign-In configuration failed:", error);
    }
  }, []);




  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="user" />
      <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
      <Stack.Screen name="note/[id]" />
      <Stack.Screen name="pdf/[id]" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  )
}