import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function UploadScreen({ navigation }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.canceled) return;

      const selectedFile = result.assets[0];
      setFile(selectedFile);
      console.log("Selected file:", selectedFile);
    } catch (error) {
      console.error("Pick error:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleUpload = async () => {
    console.log("Upload button clicked");

    if (!file) {
      Alert.alert("Error", "Please select a file first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      });
      formData.append("title", file.name);

      console.log("Starting upload...");

      const response = await fetch("http://127.0.0.1:8000/api/documents/", {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();
      console.log("Upload status:", response.status);
      console.log("Upload response text:", rawText);

      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { raw: rawText };
      }

      if (response.ok) {
        Alert.alert("Success", "Upload worked");

        setFile(null);

        navigation.navigate("DocumentAction", {
          documentId: data.id,
          documentTitle: data.title || file.name,
        });
      } else {
        Alert.alert("Upload Failed", rawText || "Unknown backend error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>

      <TouchableOpacity style={styles.pickButton} onPress={pickDocument}>
        <Text style={styles.pickText}>
          {file ? file.name : "Choose File"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.disabledButton]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.uploadText}>
          {uploading ? "Uploading..." : "Upload"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  pickButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    alignItems: "center",
  },
  pickText: {
    color: "#333",
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#4361ee",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});