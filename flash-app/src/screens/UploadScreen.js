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
import { useDispatch, useSelector } from "react-redux";
import { createDocument } from "../store/documentsSlice";
import { generateFlashcards } from "../store/flashcardsSlice";
import { generateQuiz } from "../store/quizzesSlice";

export default function UploadScreen({ route, navigation }) {
  const { courseId } = route.params;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.documents);

  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !rawText.trim()) return;
    dispatch(
      createDocument({
        course: courseId,
        title: title.trim(),
        raw_text: rawText.trim(),
        source_type: "paste",
      })
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.goBack();
      }
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Add Document</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Chapter 5 Notes"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Paste your content</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Paste lecture notes, textbook excerpts, study guide text..."
        multiline
        numberOfLines={10}
        textAlignVertical="top"
        value={rawText}
        onChangeText={setRawText}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Document</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 24, paddingTop: 60 },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  textArea: {
    minHeight: 180,
  },
  button: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
