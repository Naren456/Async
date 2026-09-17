import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from "react-native";
// Fix: Use 'react-native-safe-area-context' to resolve the deprecation warning
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { BookOpen } from "lucide-react-native";
import * as SecureStore from "../utils/secureStore";
import { useDispatch } from "react-redux";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

// global.css is imported in _layout.tsx, do not import it here
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { AuthGoogleSignIn } from "../api/apiCall";
import { DataManager } from "../utils/DataManager";
import { setUser } from "../store/reducer";

WebBrowser.maybeCompleteAuthSession();

export default function Welcome() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Web Google Auth (expo-auth-session) - FIX redirect_uri_mismatch
  // On web we must use window.location.origin (no proxy), on native we use expo proxy
  const redirectUri = makeRedirectUri({
    scheme: "async",
    useProxy: Platform.OS !== "web",
    // Web: http://localhost:8081, Production web: https://your-vercel-domain.vercel.app
    // Native proxy: https://auth.expo.io/@narendra78/async
  });
  const webClientIdReal = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const [webRequest, webResponse, webPromptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientIdReal || "dummy.apps.googleusercontent.com",
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || undefined,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID || undefined,
    webClientId: webClientIdReal || "dummy.apps.googleusercontent.com",
    redirectUri,
  });

  // Handle web auth response
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (webResponse?.type === "success") {
      const idToken = (webResponse as any).params?.id_token || (webResponse as any).authentication?.idToken;
      if (idToken) handleWebGoogleSuccess(idToken);
    } else if (webResponse?.type === "error") {
      Alert.alert("Google Sign-In Failed", "Web authentication failed");
      setIsGoogleLoading(false);
    } else if (webResponse?.type === "dismiss") {
      setIsGoogleLoading(false);
    }
  }, [webResponse]);

  const handleWebGoogleSuccess = async (idToken: string) => {
    try {
      const result = await AuthGoogleSignIn(idToken);
      await SecureStore.setItemAsync("authToken", result.token);
      await SecureStore.setItemAsync("userProfile", JSON.stringify(result.user));
      dispatch(setUser({ user: result.user, token: result.token }));
      await DataManager.prefetchUserData(result.user);
      if (result.user.role === "TEACHER") router.replace("/admin");
      else router.replace("/user/home");
    } catch (e: any) {
      Alert.alert("Google Sign-In Failed", e.message || "Something went wrong");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google Sign-In Configuration is managed securely and centrally in _layout.tsx

  const onGoogleButtonPress = async () => {
    if (Platform.OS === 'web') {
      if (!webClientIdReal) {
        Alert.alert("Not configured", "Google Sign-In not configured on web (EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID missing). Use email login or contact admin.");
        return;
      }
      if (!webRequest) {
        Alert.alert("Loading", "Google auth not ready, please try again");
        return;
      }
      console.log("Web redirectUri:", redirectUri);
      setIsGoogleLoading(true);
      try {
        await webPromptAsync();
      } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to start web sign-in");
        setIsGoogleLoading(false);
      }
      return;
    }
    setIsGoogleLoading(true);
    try {
      // 1. Ensure Google Play Services are available (Android specific)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
      
      // 2. Wipe existing local authentications to force account picker
      try { await GoogleSignin.signOut(); } catch {}
      
      // 3. Trigger authentications overlay
      const userInfo = await GoogleSignin.signIn();

      // Fix: Robust fallback extraction supporting both flattened and nested response schemas
      const responseData = userInfo as any;
      const idToken = responseData?.idToken || responseData?.data?.idToken;

      if (idToken) {
        // 4. Validate token string on Render Node.js backend 
        const result = await AuthGoogleSignIn(idToken);

        // 5. Commit backend details into encrypted device storage and state
        await SecureStore.setItemAsync("authToken", result.token);
        await SecureStore.setItemAsync("userProfile", JSON.stringify(result.user));
        dispatch(setUser({ user: result.user, token: result.token }));

        // 6. Pre-fetch user notes/assignments data local cache storage layers
        await DataManager.prefetchUserData(result.user);

        // 7. Route based on role configuration mappings
        if (result.user.role === "TEACHER") {
          router.replace("/admin");
        } else {
          router.replace("/user/home");
        }
      } else {
        // Safe alert fallback to catch structural anomalies without breaking native side
        Alert.alert(
          "Authentication Error", 
          "Failed to retrieve secure tokens from Google payload structure."
        );
        console.log("Anomalous GoogleSignin structure payload received:", JSON.stringify(userInfo));
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      if (error.code === statusCodes.IN_PROGRESS) {
        return;
      }
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services are unavailable or outdated.");
        return;
      }
      
      Alert.alert(
        "Google Sign-In Failed", 
        error.message || "Something went wrong during authentication."
      );
      console.log("Error code:", error.code);
      console.log("Error message:", error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e3a8a' }}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#1e3a8a", "#1d4ed8", "#3b82f6"]}
        style={{ flex: 1 }}
      >
        {/* Main Container */}
        <View className="flex-1 items-center justify-center px-4 md:px-8 w-full max-w-6xl mx-auto">

          {/* Animated Icon */}
          <View className="mb-6 md:mb-10">
            <View className="p-4 md:p-6 rounded-3xl bg-white/20 shadow-xl">
              <View className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/25 items-center justify-center">
                <BookOpen size={40} strokeWidth={2} color="white" />
              </View>
            </View>
          </View>

          {/* Header Text */}
          <View className="items-center px-4">
            <Text className="text-4xl md:text-6xl font-extrabold text-white tracking-wide text-center">
              ASync
            </Text>

            <Text className="text-lg md:text-xl text-white/90 text-center mt-3 md:mt-4 font-medium leading-7">
              Never miss an assignment again
            </Text>

            <Text className="text-sm md:text-base text-white/60 text-center mt-2 max-w-xs md:max-w-md leading-6">
              Smart reminders that keep you ahead in your academic journey
            </Text>
          </View>

          {/* Buttons */}
          <View className="w-full max-w-sm md:max-w-md mt-10 md:mt-14 px-4 md:px-0">

            {/* Google Button */}
            <TouchableOpacity
              onPress={onGoogleButtonPress}
              disabled={isGoogleLoading}
              activeOpacity={0.9}
              className="bg-white flex-row items-center justify-center rounded-2xl py-4 shadow-lg"
              style={Platform.select({ web: { boxShadow: "0 8px 20px rgba(0,0,0,0.3)" } as any, default: { elevation: 8 } })}
            >
              {isGoogleLoading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#2563eb" />
                  <Text className="text-blue-600 font-bold text-lg ml-3">
                    Signing in...
                  </Text>
                </View>
              ) : (
                <>
                  <View className="mr-3">
                    <Image
                      source={require("../assets/images/google-logo.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  </View>

                  <Text className="text-blue-600 font-bold text-lg">
                    Sign in with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text className="text-sm text-center text-white/70 mt-6">
              Join thousands of students staying organized
            </Text>
          </View>
        </View>

        {/* Soft decorative circles */}
        <View className="absolute top-20 right-12 w-20 h-20 rounded-full bg-white/10" />
        <View className="absolute bottom-32 left-10 w-16 h-16 rounded-full bg-white/10" />
        <View className="absolute top-1/2 right-5 w-10 h-10 rounded-full bg-white/10" />
      </LinearGradient>
    </SafeAreaView>
  );
}