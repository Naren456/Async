import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateSubject, UpdateSubject } from "../../api/apiCall";
import { useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Dropdown } from "../../components/Dropdown";

// ✅ Define types with numbers for semester & term
type SubjectFormData = {
  code: string;
  name: string;
  semester: number;
  term: number;
};

type SubjectFormProps = {
  editMode?: boolean;
  initialData?: SubjectFormData;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const SubjectForm: React.FC<SubjectFormProps> = ({
  editMode: propEditMode = false,
  initialData: propInitialData,
  onSuccess: propOnSuccess,
  onCancel: propOnCancel,
}) => {
  const params = useLocalSearchParams<{ code?: string; name?: string; semester?: string; term?: string }>();
  const router = useRouter();
  // Support both prop-based (component usage) and route-based (expo-router) usage
  const routeInitialData: SubjectFormData | undefined = params?.code ? {
    code: params.code,
    name: params.name || "",
    semester: Number(params.semester) || 1,
    term: Number(params.term) || 1,
  } : undefined;
  const editMode = propEditMode || !!routeInitialData;
  const initialData = propInitialData || routeInitialData;
  const onSuccess = propOnSuccess || (() => router.back());
  const onCancel = propOnCancel || (() => router.back());

  const [form, setForm] = useState<SubjectFormData>({
    code: "",
    name: "",
    semester: 1,
    term: 1,
  });

  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user);

  // Prefill initialData in edit mode
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (key: keyof SubjectFormData, value: string) => {
    if (key === "semester" || key === "term") {
      // Convert to number, ignore invalid input
      const num = Number(value);
      if (!isNaN(num)) setForm((prev) => ({ ...prev, [key]: num }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!form.code || !form.name || !form.semester || !form.term) {
      Alert.alert("Missing Fields", "Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      if (editMode) {
        await UpdateSubject(form.code, form);
        Alert.alert("Success", "Subject updated successfully!");
      } else {
        await CreateSubject(form);
        Alert.alert("Success", "Subject created successfully!");
      }
      onSuccess && onSuccess();
    } catch (error: any) {
      console.error("Subject Submit Error:", error);
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fields: (keyof SubjectFormData)[] = ["code", "name", "semester", "term"];

  return (
    <SafeAreaView className="flex-1 bg-[#08090B]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-white text-2xl font-bold mb-6 text-center">
            {editMode ? "Edit Subject" : "Create Subject"}
          </Text>

          <View className="bg-[#101216] rounded-2xl p-5 border border-white/10 shadow-md">
            {/* Code & Name */}
            <View className="mb-4">
              <Text className="text-gray-300 mb-2 capitalize font-medium">code</Text>
              <TextInput
                value={String(form.code)}
                onChangeText={(t) => handleChange("code", t)}
                className="bg-[#08090B] text-white rounded-xl px-4 py-3 border border-white/10"
                placeholder="Enter code (e.g. BCS ZC311)"
                placeholderTextColor="#6B7280"
                editable={!editMode}
              />
            </View>
            <View className="mb-4">
              <Text className="text-gray-300 mb-2 capitalize font-medium">name</Text>
              <TextInput
                value={String(form.name)}
                onChangeText={(t) => handleChange("name", t)}
                className="bg-[#08090B] text-white rounded-xl px-4 py-3 border border-white/10"
                placeholder="Enter subject name"
                placeholderTextColor="#6B7280"
              />
            </View>
            {/* Semester Dropdown */}
            <View className="mb-4">
              <Dropdown
                label="semester"
                value={String(form.semester)}
                onValueChange={(v) => handleChange("semester", v)}
                placeholder="Select semester"
                options={[1,2,3,4,5,6,7,8].map(n=>({label:`Semester ${n}`, value:String(n)}))}
              />
            </View>
            {/* Term Dropdown */}
            <View className="mb-4">
              <Dropdown
                label="term"
                value={String(form.term)}
                onValueChange={(v) => handleChange("term", v)}
                placeholder="Select term"
                options={[1,2,3,4].map(n=>({label:`Term ${n}`, value:String(n)}))}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`py-3 rounded-xl mt-2 ${loading ? "bg-gray-600" : "bg-blue-600"}`}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? (editMode ? "Updating..." : "Creating...") : editMode ? "Update Subject" : "Create Subject"}
              </Text>
            </TouchableOpacity>

            {editMode && onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="py-3 mt-3 rounded-xl bg-gray-700 active:opacity-80"
              >
                <Text className="text-white text-center font-semibold text-base">
                  Cancel Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SubjectForm;
