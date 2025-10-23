import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { ArrowLeft, FileUp, XCircle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { UploadNote } from '../../api/admin'; // Make sure this is correctly imported

const UploadNoteScreen = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const { subjectCode, subjectName } = useLocalSearchParams<{ subjectCode: string; subjectName: string }>();

  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Redirect if required data is missing
    if (!subjectCode || !subjectName || user?.role !== 'TEACHER') {
      Alert.alert("Error", "Missing subject information or invalid access.");
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/admin'); // Fallback route
      }
    }
  }, [subjectCode, subjectName, user, router]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Selected file:', asset.uri, asset.mimeType, asset.name);
        setSelectedFile(asset);
        // Pre-fill title, remove .pdf extension if present
        setNoteTitle(asset.name.replace(/\.pdf$/i, ''));
      } else {
        console.log('Document picking cancelled or failed');
        // Optionally clear state if needed, though often not necessary on cancel
        // setSelectedFile(null);
        // setNoteTitle('');
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document.');
      setSelectedFile(null);
      setNoteTitle('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !noteTitle.trim() || !subjectCode) {
      Alert.alert('Missing Info', 'Please select a PDF file and enter a title.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('pdf', {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.mimeType ?? 'application/pdf',
    } as any);
    formData.append('title', noteTitle.trim());
    formData.append('subjectCode', subjectCode);

    try {
      await UploadNote(user.token, formData);
      Alert.alert('Success', 'Note uploaded successfully!', [
        { text: "OK", onPress: () => router.back() } // Go back after success
      ]);
      // Reset state locally if needed, though navigation handles it
      setSelectedFile(null);
      setNoteTitle('');
    } catch (e: any) {
      console.error("Upload failed:", e);
      Alert.alert('Upload Failed', e?.message || 'Could not upload the note.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setNoteTitle('');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f172b]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-white/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#60A5FA" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white text-center flex-1 mx-4" numberOfLines={1} ellipsizeMode="tail">
          Upload Note
        </Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-lg text-gray-300 mb-4 text-center">
          Subject: <Text className="font-semibold text-white">{subjectName} ({subjectCode})</Text>
        </Text>

        {/* File Picker Button */}
        {!selectedFile && (
          <TouchableOpacity
            onPress={pickDocument}
            className="flex-row items-center justify-center py-4 px-6 bg-blue-600 rounded-xl mb-6"
            activeOpacity={0.7}
          >
            <FileUp size={20} color="white" />
            <Text className="text-white text-base font-semibold ml-2">Select PDF File</Text>
          </TouchableOpacity>
        )}

        {/* Selected File Info & Title Input */}
        {selectedFile && (
          <View className="mb-6 p-4 bg-[#1e293b] rounded-xl border border-white/10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-green-400 font-medium flex-1 mr-2" numberOfLines={1} ellipsizeMode="middle">
                File: {selectedFile.name}
              </Text>
              <TouchableOpacity onPress={clearSelection} className="p-1">
                 <XCircle size={20} color="#EF4444"/>
              </TouchableOpacity>
            </View>

            <Text className="text-white text-base font-medium mb-2">Note Title</Text>
            <TextInput
              value={noteTitle}
              onChangeText={setNoteTitle}
              placeholder="Enter note title"
              placeholderTextColor="#6B7280"
              className="bg-[#0f172b] text-white rounded-lg px-4 py-3 border border-white/10"
            />
          </View>
        )}

        {/* Upload Button */}
        {selectedFile && (
           <TouchableOpacity
            onPress={handleUpload}
            disabled={isUploading || !noteTitle.trim()}
            className={`py-4 rounded-xl ${isUploading || !noteTitle.trim() ? "bg-gray-600" : "bg-green-600"} ${!selectedFile ? 'hidden' : ''}`}
            activeOpacity={0.8}
           >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Upload Note
              </Text>
            )}
           </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadNoteScreen;