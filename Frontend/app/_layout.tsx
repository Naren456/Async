import { Stack, SplashScreen } from "expo-router";
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
// Hide splash screen immediately
SplashScreen.hideAsync();

function AppLayout() {

  const { expoPushToken } = usePushNotifications();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (user && user.token && expoPushToken) {
      UpdatePushToken(expoPushToken).catch(err => console.error("Failed to sync push token", err));
    }
  }, [user, expoPushToken]);

  useEffect(() => {
    console.log("Configuring Google Sign-In with Web Client ID:", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
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