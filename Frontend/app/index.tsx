import { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from '../utils/secureStore';
import { useDispatch } from 'react-redux';
import { GetMe } from '../api/apiCall';
import { setUser } from '../store/reducer';
import { StatusBar } from 'expo-status-bar';
import { DataManager } from '../utils/DataManager';



export default function AppEntry() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const checkUserSession = async () => {
      let token = null;
      try {
        token = await SecureStore.getItemAsync("authToken");

        if (token) {
          const result = await GetMe();
          if (!mounted) return;
          // Save for offline future
          await SecureStore.setItemAsync("userProfile", JSON.stringify(result.user));
          dispatch(setUser({ user: result.user, token: token }));
          await DataManager.prefetchUserData(result.user);
          if (!mounted) return;
          if (result.user.role === "TEACHER") {
            router.replace("/admin");
          } else {
            router.replace("/user/home");
          }
        } else {
          if (mounted) router.replace("/welcome");
        }
      } catch (e: any) {
        console.error("Session check failed:", e);
        // OFFLINE BUG FIX: Do NOT sign out on network error - keep token
        if (e.isNetworkError) {
          try {
            const cachedUserString = await SecureStore.getItemAsync("userProfile");
            if (cachedUserString && token && mounted) {
              const cachedUser = JSON.parse(cachedUserString);
              dispatch(setUser({ user: cachedUser, token: token }));
              if (cachedUser.role === "TEACHER") {
                router.replace("/admin");
              } else {
                router.replace("/user/home");
              }
              return;
            }
            // Even without cache, keep token for retry - don't delete
            // Try to stay offline by using token alone if we have any cached assignments
            if (token && mounted) {
              console.log("Offline with no cached profile - keeping token, navigating to home for cached data");
              // Create minimal user from token cache? Fall back to welcome without deleting token
              // Don't delete token, just go to welcome but preserve token for next launch
              router.replace("/welcome");
              return;
            }
          } catch (cacheErr) {
            console.error("Failed to load cached user profile for offline mode:", cacheErr);
          }
          // Network error without cache: keep token, don't sign out
          if (mounted && token) {
            console.log("Network error - preserving token for retry");
            // Keep token, navigate to welcome without deleting so user can retry when online
            router.replace("/welcome");
            return;
          }
        }
        // Only sign out on explicit auth failure (401) or other non-network errors
        if (mounted) {
          if (e.status === 401) {
            if (token) {
              await SecureStore.deleteItemAsync("authToken");
              await SecureStore.deleteItemAsync("userProfile");
            }
            dispatch(setUser({ user: null }));
          } else if (e.isNetworkError) {
            // Already handled above, but fallback: don't delete
            dispatch(setUser({ user: null }));
          } else {
            // Other errors (e.g., server 500) - keep token? Better to keep for retry as well
            // Don't delete on 5xx
            if (e.status >= 500) {
              console.log("Server error - keeping token for retry");
              router.replace("/welcome");
              return;
            }
            if (token) {
              await SecureStore.deleteItemAsync("authToken");
              await SecureStore.deleteItemAsync("userProfile");
            }
            dispatch(setUser({ user: null }));
          }
          router.replace("/welcome");
        }
      }
    };

    checkUserSession();
    return () => { mounted = false; };
  }, []);

  // Show a persistent loading screen while checking the session
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#08090B' }}>
      <StatusBar style='light' />
      <ActivityIndicator size="large" color="#60a5fa" />
      <Text style={{ marginTop: 10, color: 'white' }}>Checking session...</Text>
    </View>
  );
}