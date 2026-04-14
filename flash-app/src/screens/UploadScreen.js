import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export default function UploadScreen({ navigation }) {
  const [file, setFile] = useState(null);
  const [statusText, setStatusText] = useState("No file selected");
  const [uploading, setUploading] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      console.log("PICK RESULT:", result);

      if (result.canceled) {
        setStatusText("Selection canceled");
        return;
      }

      const selectedFile = result.assets?.[0];
      setFile(selectedFile);
      setStatusText(selectedFile?.name || "Unknown file");
    } catch (error) {
      console.error("DOCUMENT PICKER ERROR:", error);
      setStatusText("Picker failed");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatusText("Please choose a file first");
      return;
    }

    try {
      setUploading(true);
      setStatusText("Uploading...");

      // TEMPORARY SUCCESS TEST
      // We are only proving navigation works after upload logic.
      setTimeout(() => {
        navigation.navigate("DocumentAction", {
          documentId: 1,
          documentTitle: file.name,
        });
      }, 500);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      setStatusText("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>
      <Text style={styles.subtitle}>{statusText}</Text>

      <Pressable style={styles.button} onPress={handlePickFile}>
        <Text style={styles.buttonText}>Choose File</Text>
      </Pressable>

      <Pressable
        style={[styles.button, uploading && styles.disabledButton]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Upload"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4361ee",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
    minWidth: 180,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});