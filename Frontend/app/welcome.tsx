import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
// Fix: Use 'react-native-safe-area-context' to resolve the deprecation warning
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { BookOpen } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";

import "./global.css";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { AuthGoogleSignIn } from "../api/apiCall";
import { DataManager } from "../utils/DataManager";
import { setUser } from "../store/reducer";

export default function Welcome() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Initialize the Google Sign-In Configuration when the screen mounts
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // Automatically extracted from your .env file
      offlineAccess: false,
    });
  }, []);

  const onGoogleButtonPress = async () => {
    setIsGoogleLoading(true);
    try {
      // 1. Ensure Google Play Services are available (Android specific)
      await GoogleSignin.hasPlayServices();
      
      // 2. Wipe existing local authentications to force account picker
      await GoogleSignin.signOut();
      
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
    <SafeAreaView className="flex-1 bg-blue-900">
      <StatusBar style="light" />

      <LinearGradient
        colors={["#1e3a8a", "#1d4ed8", "#3b82f6"]}
        className="flex-1"
      >
        {/* Main Container */}
        <View className="flex-1 items-center justify-center px-8">

          {/* Animated Icon */}
          <View className="mb-10">
            <View className="p-6 rounded-3xl bg-white/10 backdrop-blur-md shadow-xl">
              <View className="w-20 h-20 rounded-2xl bg-white/25 items-center justify-center">
                <BookOpen size={40} strokeWidth={2} color="white" />
              </View>
            </View>
          </View>

          {/* Header Text */}
          <View className="items-center">
            <Text className="text-6xl font-extrabold text-white tracking-wide">
              ASync
            </Text>

            <Text className="text-xl text-white/90 text-center mt-4 font-medium leading-7">
              Never miss an assignment again
            </Text>

            <Text className="text-base text-white/60 text-center mt-2 max-w-xs leading-6">
              Smart reminders that keep you ahead in your academic journey
            </Text>
          </View>

          {/* Buttons */}
          <View className="w-full max-w-sm mt-14">

            {/* Google Button */}
            <TouchableOpacity
              onPress={onGoogleButtonPress}
              disabled={isGoogleLoading}
              activeOpacity={0.9}
              className="bg-white flex-row items-center justify-center rounded-2xl py-4 shadow-lg"
              style={{ 
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
              }}
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
        <View className="absolute top-20 right-12 w-20 h-20 rounded-full bg-white/10 blur-xl" />
        <View className="absolute bottom-32 left-10 w-16 h-16 rounded-full bg-white/10 blur-lg" />
        <View className="absolute top-1/2 right-5 w-10 h-10 rounded-full bg-white/10 blur-md" />
      </LinearGradient>
    </SafeAreaView>
  );
}