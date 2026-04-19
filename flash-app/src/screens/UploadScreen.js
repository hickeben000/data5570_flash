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

  const [mode, setMode] = useState("upload"); // "upload" | "paste"
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [fileStatus, setFileStatus] = useState("No file selected.");

  const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

  const handleSwitchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    // Clear only the data belonging to the mode we're leaving.
    if (newMode === "upload") {
      setRawText("");
    } else {
      setFile(null);
      setFileStatus("No file selected.");
    }
    dispatch(clearDocumentsError());
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) {
        setFileStatus("Selection canceled.");
        return;
      }

      const selectedFile = result.assets?.[0];

      if (selectedFile?.size > MAX_FILE_BYTES) {
        setFileStatus("File is too large. Please choose a file under 20 MB.");
        return;
      }

      setFile(selectedFile);
      if (!title && selectedFile?.name) {
        setTitle(selectedFile.name.replace(/\.[^.]+$/, ""));
      }
      setFileStatus(`Selected: ${selectedFile?.name || "file"}`);
      dispatch(clearDocumentsError());
    } catch (_error) {
      setFileStatus("File selection failed.");
    }
  };

  const handleSubmit = () => {
    if (!courseId) {
      alert("Open upload from a course so the document has somewhere to live.");
      return;
    }

    if (mode === "upload") {
      if (!file) {
        setFileStatus("Choose a file before submitting.");
        return;
      }
    } else {
      if (!rawText.trim()) {
        dispatch(clearDocumentsError());
        alert("Paste your notes before submitting.");
        return;
      }
      if (!title.trim()) {
        alert("Please add a title for your pasted notes.");
        return;
      }
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
        Upload a file and we'll extract the text, or paste the text yourself.
      </Text>

      {/* Mode tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, mode === "upload" && styles.tabActive]}
          onPress={() => handleSwitchMode("upload")}
        >
          <Text style={[styles.tabText, mode === "upload" && styles.tabTextActive]}>
            Upload File
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === "paste" && styles.tabActive]}
          onPress={() => handleSwitchMode("paste")}
        >
          <Text style={[styles.tabText, mode === "paste" && styles.tabTextActive]}>
            Paste Text
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title — always shown; required for paste, auto-filled for upload */}
      <Text style={styles.label}>
        Title{mode === "paste" ? " *" : " (auto-filled from filename)"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Chapter 3 Review"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          dispatch(clearDocumentsError());
        }}
      />

      {/* Upload mode: file picker only */}
      {mode === "upload" && (
        <View style={styles.fileCard}>
          <Text style={styles.fileStatus}>{fileStatus}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handlePickFile}>
            <Text style={styles.secondaryButtonText}>
              {file ? "Change File" : "Choose File"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Paste mode: text area only */}
      {mode === "paste" && (
        <>
          <Text style={styles.label}>Paste text *</Text>
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
        </>
      )}

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
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#eef1ff",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#4361ee",
  },
  tabText: {
    fontWeight: "700",
    color: "#4361ee",
  },
  tabTextActive: {
    color: "#fff",
  },
  fileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dfe4f1",
  },
  fileStatus: {
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
