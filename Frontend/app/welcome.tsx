import React from "react";
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { BookOpen } from "lucide-react-native";
import './global.css'


const { width, height } = Dimensions.get("window");

export default function Welcome() { // Renamed from Index
  const router = useRouter();

 
  return (
    <SafeAreaView className="flex-1 bg-blue-900">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
        locations={[0, 0.5, 1]}
        style={{ flex: 1 }}
      >
        <View className="flex-1 items-center justify-center px-8">
          {/* Header Section */}
          <View className="justify-center items-center mb-16">
            {/* Logo Container */}
            <View className="mb-6 p-5 rounded-full bg-white/15 backdrop-blur-sm">
              <View className="w-16 h-16 rounded-full bg-white/25 items-center justify-center">
                <BookOpen size={32} color="white" strokeWidth={2} />
              </View>
            </View>

            <Text className="text-5xl font-bold text-white mb-4 tracking-wide">
              ASync
            </Text>
            <Text className="text-xl text-white/90 text-center leading-7 px-6 font-medium">
              Never miss an assignment again
            </Text>
            <Text className="text-base text-white/70 text-center leading-6 px-4 mt-2">
              Smart reminders for academic success
            </Text>
          </View>

          {/* Buttons */}
          <View className="w-full max-w-sm">
            {/* Get Started */}
            <TouchableOpacity
              className="w-full py-4 rounded-2xl shadow-lg mb-4 bg-white"
              onPress={() => router.push("/auth/signup")}
              activeOpacity={0.8}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-lg font-bold text-blue-600 text-center">
                Get Started
              </Text>
            </TouchableOpacity>

            {/* Sign In */}
            <TouchableOpacity
              className="w-full py-4 rounded-2xl border-2 border-white/30 mb-6"
              onPress={() => router.push("/auth/signin")}
              activeOpacity={0.8}
            >
              <Text className="text-lg font-semibold text-white text-center">
                I Already Have an Account
              </Text>
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-sm text-white/70 text-center leading-5">
                Join thousands of students staying organized
              </Text>
            </View>
          </View>
        </View>

        {/* Decorative Elements */}
        <View className="absolute top-24 right-12 w-16 h-16 rounded-full bg-white/5" />
        <View className="absolute top-44 left-10 w-10 h-10 rounded-full bg-white/5" />
        <View className="absolute bottom-36 right-8 w-14 h-14 rounded-full bg-white/5" />
      </LinearGradient>
    </SafeAreaView>
  );
}