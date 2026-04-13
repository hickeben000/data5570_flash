import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function UploadScreen() {
  const [file, setFile] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.canceled) return;

      const selectedFile = result.assets[0];
      setFile(selectedFile);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a file first");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      });

      formData.append("title", file.name);

      const response = await fetch(
        "http://127.0.0.1:8000/api/documents/",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "File uploaded!");
        setFile(null);
      } else {
        Alert.alert("Error", JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Upload failed");
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

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadText}>Upload</Text>
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
  uploadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});