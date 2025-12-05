import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { BookOpen } from "lucide-react-native";
import { MotiView } from "moti";

import "./global.css";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { AuthGoogleSignIn } from "@/api/apiCall";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/reducer";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

export default function Welcome() {
  const router = useRouter();
  const dispatch = useDispatch();

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        const result = await AuthGoogleSignIn(userInfo.data.idToken);

        await SecureStore.setItemAsync("authToken", result.token);
        dispatch(setUser({ user: result.user, token: result.token }));

        if (result.user.role === "TEACHER") {
          router.replace("/admin");
        } else {
          router.replace("/user/home");
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services are unavailable");
        return;
      }
      Alert.alert("Google Sign-In Failed", error.message || "Something went wrong");
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
          <MotiView
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 900 }}
            className="mb-10"
          >
            <View className="p-6 rounded-3xl bg-white/10 backdrop-blur-md shadow-xl">
              <View className="w-20 h-20 rounded-2xl bg-white/25 items-center justify-center">
                <BookOpen size={40} strokeWidth={2} color="white" />
              </View>
            </View>
          </MotiView>

          {/* Header Text */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 800, delay: 300 }}
            className="items-center"
          >
            <Text className="text-6xl font-extrabold text-white tracking-wide">
              ASync
            </Text>

            <Text className="text-xl text-white/90 text-center mt-4 font-medium leading-7">
              Never miss an assignment again
            </Text>

            <Text className="text-base text-white/60 text-center mt-2 max-w-xs leading-6">
              Smart reminders that keep you ahead in your academic journey
            </Text>
          </MotiView>

          {/* Buttons */}
          <View className="w-full max-w-sm mt-14">

            {/* Google Button */}
            <TouchableOpacity
              onPress={onGoogleButtonPress}
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
