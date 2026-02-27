import React, { useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyRound, Mail, ArrowLeft } from "lucide-react-native";
import { Toast } from "../../components/Toast";

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
});

export default function ForgotPassword() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", type: "info" as "success" | "error" | "info" });

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ visible: true, message, type });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, visible: false }));
    };

    const handleResetPassword = async (values: { email: string }) => {
        setIsLoading(true);
        // TODO: Implement actual API call
        setTimeout(() => {
            setIsLoading(false);
            setIsLoading(false);
            showToast("If an account exists, we've sent reset instructions.", "success");
            setTimeout(() => {
                router.back();
            }, 2000);
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0f172b]">
            <StatusBar style="light" />
            <LinearGradient
                colors={["#1e3a8a", "#2563eb", "#60a5fa"]}
                locations={[0, 0.5, 1]}
                style={{ flex: 1 }}
            >
                <View className="flex-1 px-8">
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-4 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>

                    <View className="flex-1 items-center justify-center">
                        {/* Header */}
                        <View className="justify-center items-center mb-12">
                            <View className="mb-4 p-4 rounded-full bg-white/15 backdrop-blur-sm">
                                <View className="w-12 h-12 rounded-full bg-white/25 items-center justify-center">
                                    <KeyRound size={24} color="white" strokeWidth={2} />
                                </View>
                            </View>
                            <Text className="text-3xl font-bold text-white mb-2 text-center">
                                Reset Password
                            </Text>
                            <Text className="text-base text-white/80 text-center max-w-xs">
                                Enter your email address and we'll send you instructions to reset your password.
                            </Text>
                        </View>

                        <Formik
                            initialValues={{ email: "" }}
                            validationSchema={ForgotPasswordSchema}
                            onSubmit={(values) => handleResetPassword(values)}
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
                                    <View className="mb-6">
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

                                    {/* Submit Button */}
                                    <TouchableOpacity
                                        onPress={() => handleSubmit()}
                                        disabled={isLoading}
                                        className={`py-4 rounded-xl mb-6 ${isLoading ? "bg-white/50" : "bg-white"
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
                                                    Sending...
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text className="text-blue-600 text-center font-bold text-lg">
                                                Send Instructions
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
                <Toast
                    visible={toast.visible}
                    message={toast.message}
                    type={toast.type}
                    onHide={hideToast}
                />
            </LinearGradient>
        </SafeAreaView>
    );
}
