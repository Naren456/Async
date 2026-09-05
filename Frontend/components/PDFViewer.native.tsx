import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from 'expo-file-system/legacy';
import Pdf from 'react-native-pdf';

export default function PDFScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const router = useRouter();
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const pdfUrl = decodeURIComponent(url || "");
  const fileName = title || "document.pdf";

  useEffect(() => {
    const downloadPdf = async () => {
      if (!pdfUrl) return;

      try {
        setLoading(true);
        // Create a local URI for the file
        const fileUri = FileSystem.documentDirectory + fileName.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';

        // Check if file already exists (optional optimization, but good for retries)
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
           setLocalUri(fileUri);
        } else {
           // Download the PDF
           const downloadRes = await FileSystem.downloadAsync(pdfUrl, fileUri);
           setLocalUri(downloadRes.uri);
        }
      } catch (error) {
        console.error("PDF Download Error:", error);
        Alert.alert("Error", "Could not download the PDF.");
      } finally {
        setLoading(false);
      }
    };

    downloadPdf();
  }, [pdfUrl]);

  if (!pdfUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No PDF URL provided.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || "Document"}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {loading && (
          <View style={[styles.center, StyleSheet.absoluteFill]}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
        
        {localUri && (
          <>
            <Pdf
              source={{ uri: localUri, cache: true }}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
                setTotalPages(numberOfPages);
                setLoading(false);
              }}
              onPageChanged={(page, numberOfPages) => {
                setCurrentPage(page);
              }}
              onError={(error) => {
                console.log(error);
                Alert.alert('Error', 'Failed to load PDF');
              }}
              onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdf}
              enablePaging={false}
              showsVerticalScrollIndicator={true}
            />
            {/* Page Number Indicator */}
            <View style={styles.pageIndicatorContainer}>
              <Text style={styles.pageIndicatorText}>
                {currentPage} / {totalPages}
              </Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090B",
    height: '100%'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "#101216",
    zIndex: 10,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#08090B',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    backgroundColor: '#08090B',
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#f87171",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#08090B',
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: 24,
    backgroundColor: 'rgba(15, 23, 43, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pageIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});