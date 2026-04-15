import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";

import { clearDocumentsError, createDocument } from "../store/documentsSlice";
import formatError from "../utils/formatError";

export default function UploadScreen({ route, navigation }) {
  const { courseId } = route.params || {};
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.documents);

  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [statusText, setStatusText] = useState("Paste notes or choose a file.");

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled) {
        setStatusText("Selection canceled.");
        return;
      }

      const selectedFile = result.assets?.[0];
      setFile(selectedFile);
      if (!title && selectedFile?.name) {
        setTitle(selectedFile.name.replace(/\.[^.]+$/, ""));
      }
      setStatusText(`Selected ${selectedFile?.name || "file"}.`);
      dispatch(clearDocumentsError());
    } catch (_error) {
      setStatusText("File selection failed.");
    }
  };

  const handleSubmit = () => {
    if (!courseId) {
      setStatusText("Open upload from a course so the document has somewhere to live.");
      return;
    }

    if (!file && !rawText.trim()) {
      setStatusText("Add pasted text or choose a file before submitting.");
      return;
    }

    dispatch(
      createDocument({
        course: courseId,
        title: title.trim(),
        rawText: rawText.trim(),
        file,
      })
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("DocumentAction", {
          courseId,
          documentId: action.payload.id,
          documentTitle: action.payload.title,
        });
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add Document</Text>
      <Text style={styles.subtitle}>
        Paste notes directly or upload a file. The backend extracts the text and saves it to the selected course.
      </Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Chapter 3 Review"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          dispatch(clearDocumentsError());
        }}
      />

      <Text style={styles.label}>Paste text</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Paste lecture notes, study guide text, or assignment content here."
        multiline
        value={rawText}
        onChangeText={(text) => {
          setRawText(text);
          dispatch(clearDocumentsError());
        }}
      />

      <View style={styles.fileCard}>
        <Text style={styles.fileTitle}>File upload</Text>
        <Text style={styles.fileStatus}>{statusText}</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={handlePickFile}>
          <Text style={styles.secondaryButtonText}>Choose File</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{formatError(error)}</Text> : null}

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Save Document</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    color: "#666",
    lineHeight: 22,
  },
  label: {
    marginBottom: 8,
    fontWeight: "700",
    color: "#374151",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dfe4f1",
    marginBottom: 14,
  },
  textArea: {
    minHeight: 180,
    textAlignVertical: "top",
  },
  fileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dfe4f1",
  },
  fileTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  fileStatus: {
    marginTop: 8,
    marginBottom: 12,
    color: "#555",
  },
  secondaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#eef1ff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: "#4361ee",
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#4361ee",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  error: {
    color: "#c0392b",
    marginBottom: 12,
  },
});
