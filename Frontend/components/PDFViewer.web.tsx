import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ALLOWED_PDF_DOMAINS = ['res.cloudinary.com', 'cloudinary.com'];

function isAllowedPdfUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') return false;
    return ALLOWED_PDF_DOMAINS.some(d => parsed.hostname.endsWith(d));
  } catch { return false; }
}

export default function PDFScreenWeb() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const router = useRouter();

  let pdfUrl = "";
  try { pdfUrl = decodeURIComponent(url || ""); } catch { pdfUrl = url || ""; }

  if (!pdfUrl || !isAllowedPdfUrl(pdfUrl)) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{!pdfUrl ? "No PDF URL provided." : "Invalid PDF URL domain."}</Text>
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

      {/* Main Content using an iframe for the web */}
      <View style={styles.content}>
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title={title || "PDF Document"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090B",
    height: '100vh' // Use vh on web to ensure full height
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
    backgroundColor: '#08090B',
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: "#f87171",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },
});
