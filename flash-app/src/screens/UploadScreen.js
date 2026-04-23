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
import { colors, radius, shadows } from "../theme";

export default function UploadScreen({ route, navigation }) {
  const { courseId } = route.params || {};
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.documents);

  const [mode, setMode] = useState("upload");
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [fileStatus, setFileStatus] = useState("No file selected.");

  const MAX_FILE_BYTES = 20 * 1024 * 1024;

  const handleSwitchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
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
        {["upload", "paste"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, mode === tab && styles.tabActive]}
            onPress={() => handleSwitchMode(tab)}
          >
            <Text style={[styles.tabText, mode === tab && styles.tabTextActive]}>
              {tab === "upload" ? "Upload File" : "Paste Text"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.label}>
        Title{mode === "paste" ? " *" : " (auto-filled from filename)"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Chapter 3 Review"
        placeholderTextColor={colors.fg3}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          dispatch(clearDocumentsError());
        }}
      />

      {/* Upload mode */}
      {mode === "upload" && (
        <View style={styles.fileCard}>
          <Text style={styles.fileStatusText}>{fileStatus}</Text>
          <TouchableOpacity style={styles.chooseFileBtn} onPress={handlePickFile}>
            <Text style={styles.chooseFileBtnText}>
              {file ? "Change File" : "Choose File"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Paste mode */}
      {mode === "paste" && (
        <>
          <Text style={styles.label}>Paste text *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Paste lecture notes, study guide text, or assignment content here."
            placeholderTextColor={colors.fg3}
            multiline
            value={rawText}
            onChangeText={(text) => {
              setRawText(text);
              dispatch(clearDocumentsError());
            }}
          />
        </>
      )}

      {error ? (
        <Text style={styles.error}>{formatError(error)}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.primaryBtn, loading && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>Save Document</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 680,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.fg1,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: colors.fg2,
    lineHeight: 22,
    fontSize: 14,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radius.md,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontWeight: "700",
    fontSize: 14,
    color: colors.primary,
  },
  tabTextActive: {
    color: "#fff",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: radius.md,
    padding: 13,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.fg1,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 180,
    textAlignVertical: "top",
  },
  fileCard: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    ...shadows.low,
  },
  fileStatusText: {
    fontSize: 14,
    color: colors.fg2,
  },
  chooseFileBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  chooseFileBtnText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  error: {
    color: colors.errorDark,
    marginBottom: 12,
    fontSize: 14,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    ...shadows.mid,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
