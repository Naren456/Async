import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import * as Yup from "yup";
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { AuthsignIn } from "@/api/apiCall";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/reducer";
import * as SecureStore from "expo-secure-store";


// Validation schema
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false); // For email/pass login
  const [showPassword, setShowPassword] = useState(false);

  // --- Email/Password Sign-In Handler ---
  const handleSignIn = async (
    values: { email: string; password: string },
    setErrors: (errors: { [key: string]: string }) => void
  ) => {
    console.log("Form values:", values);
    setIsLoading(true);

    try {
      const result = await AuthsignIn(values);
      await SecureStore.setItemAsync("authToken", result.token);
      dispatch(setUser({ user: result.user }));
      // await showLoginNotification(result.user.name);
      // Redirect based on user role
      if (result.user.role === "TEACHER") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.message || e.message || "Something went wrong";

      // Show error as alert for better UX
      Alert.alert("Sign In Failed", errorMsg);
      setErrors({ general: errorMsg });
      console.log("SignIn Error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b]">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
        locations={[0, 0.5, 1]}
        style={{ flex: 1 }}
      >
        <View className="flex-1 items-center justify-center px-8">
          {/* Header */}
          <View className="justify-center items-center mb-12">
            <View className="mb-4 p-4 rounded-full bg-white/15 backdrop-blur-sm">
              <View className="w-12 h-12 rounded-full bg-white/25 items-center justify-center">
                <BookOpen size={24} color="white" strokeWidth={2} />
              </View>
            </View>
            <Text className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-white/80 text-center">
              Sign in to manage your assignments
            </Text>
          </View>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={SignInSchema}
            onSubmit={(values, { setErrors }) =>
              handleSignIn(values, setErrors)
            }
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View className="w-full max-w-sm">
                {/* Email Input */}
                <View className="mb-4">
                  <Text className="text-white mb-2 text-base font-medium">
                    Email
                  </Text>
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <Mail
                        size={20}
                        color="rgba(0,0,0,0.4)"
                        strokeWidth={2}
                      />
                    </View>
                    <TextInput
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      className="bg-white rounded-xl px-12 py-4 text-gray-800 text-base"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                  {errors.email && touched.email && (
                    <Text className="text-red-300 text-sm mt-1 ml-1">
                      {errors.email}
                    </Text>
                  )}
                </View>

                {/* Password Input */}
                <View className="mb-6">
                  <Text className="text-white mb-2 text-base font-medium">
                    Password
                  </Text>
                  <View className="relative">
                    <View className="absolute left-3 top-3 z-10">
                      <Lock
                        size={20}
                        color="rgba(0,0,0,0.4)"
                        strokeWidth={2}
                      />
                    </View>
                    <TextInput
                      secureTextEntry={!showPassword}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      className="bg-white rounded-xl px-12 py-4 text-gray-800 text-base pr-12"
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                      activeOpacity={0.7}
                    >
                      {showPassword ? (
                        <EyeOff
                          size={20}
                          color="rgba(0,0,0,0.4)"
                          strokeWidth={2}
                        />
                      ) : (
                        <Eye
                          size={20}
                          color="rgba(0,0,0,0.4)"
                          strokeWidth={2}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text className="text-red-300 text-sm mt-1 ml-1">
                      {errors.password}
                    </Text>
                  )}
                </View>

                {/* Forgot Password Link */}
                <TouchableOpacity
                  className="mb-6"
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                    Alert.alert("Forgot Password", "Feature coming soon!");
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-white/80 text-sm text-right underline">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Sign In Button */}
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={isLoading}
                  className={`py-4 rounded-xl mb-6 ${
                    isLoading ? "bg-white/50" : "bg-white"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="#3B82F6" />
                      <Text className="text-blue-600 ml-2 font-bold text-lg">
                        Signing In...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-blue-600 text-center font-bold text-lg">
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Sign Up Link */}
                <TouchableOpacity
                  onPress={() => router.push("/auth/signup")}
                  activeOpacity={0.7}
                  className="items-center"
                >
                  <Text className="text-base font-medium text-white/90 text-center">
                    Don't have an account?{" "}
                    <Text className="font-bold underline">Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>

        {/* Decorative Elements */}
        <View className="absolute top-20 right-10 w-16 h-16 rounded-full bg-white/5" />
        <View className="absolute top-40 left-8 w-10 h-10 rounded-full bg-white/5" />
        <View className="absolute bottom-32 right-6 w-12 h-12 rounded-full bg-white/5" />
      </LinearGradient>
    </SafeAreaView>
  );
}