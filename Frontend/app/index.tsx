import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { GetMe } from '@/api/apiCall';
import { setUser } from '@/store/reducer';
import { StatusBar } from 'expo-status-bar';



export default function AppEntry() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      let token = null;
      try {
        // 1. Retrieve the token from secure storage
        token = await SecureStore.getItemAsync("authToken");

        if (token) {
          // 2. If token exists, validate it and fetch user details
          const result = await GetMe();

          // 3. Restore Redux session
          // Pass the token to the reducer
          dispatch(setUser({ user: result.user, token: token }));

          // 4. Navigate based on user role
          if (result.user.role === "TEACHER") {
            router.replace("/admin");
          } else {
            router.replace("/user/home");
          }
        } else {
          // 5. No token found, redirect to the welcome screen
          router.replace("/welcome");
        }
      } catch (e) {
        // 6. Token is invalid/expired (e.g., 401 error). Clear it.
        console.error("Session check failed, navigating to welcome screen:", e);

        if (token) {
          await SecureStore.deleteItemAsync("authToken");
        }
        dispatch(setUser({ user: null }));

        // Redirect to the welcome screen
        router.replace("/welcome");
      } finally {
        // 7. Hide the splash screen once navigation is complete
        // SplashScreen.hideAsync();
      }
    };

    checkUserSession();
  }, []);

  // Show a persistent loading screen while checking the session
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172b' }}>
      <StatusBar style='light' />
      <ActivityIndicator size="large" color="#60a5fa" />
      <Text style={{ marginTop: 10, color: 'white' }}>Checking session...</Text>
    </View>
  );
}