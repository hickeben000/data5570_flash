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

import { generateQuiz } from "../store/quizzesSlice";
import formatError from "../utils/formatError";

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function QuizConfigScreen({ route, navigation }) {
  const { documentId, additionalDocumentIds = [] } = route.params;
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.quizzes);

  const [difficulty, setDifficulty] = useState("medium");
  const [mcCount, setMcCount] = useState("2");
  const [fitbCount, setFitbCount] = useState("1");
  const [frCount, setFrCount] = useState("1");
  const [className, setClassName] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [extraPrompt, setExtraPrompt] = useState("");

  const handleGenerate = () => {
    dispatch(
      generateQuiz({
        documentId,
        additionalDocumentIds,
        difficulty,
        mc_count: parseInt(mcCount, 10) || 0,
        fitb_count: parseInt(fitbCount, 10) || 0,
        fr_count: parseInt(frCount, 10) || 0,
        class_name: className.trim(),
        learning_objectives: learningObjectives.trim(),
        extra_prompt: extraPrompt.trim(),
      })
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Quiz", { quizId: action.payload.id });
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Configure Quiz</Text>
      <Text style={styles.subtitle}>
        Your Gemini key stays on-device and is only sent with AI-backed quiz requests.
      </Text>

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.row}>
        {DIFFICULTIES.map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.chip, difficulty === level && styles.chipActive]}
            onPress={() => setDifficulty(level)}
          >
            <Text
              style={[
                styles.chipText,
                difficulty === level && styles.chipTextActive,
              ]}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Multiple Choice questions</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={mcCount}
        onChangeText={setMcCount}
      />

      <Text style={styles.label}>Fill in the Blank questions</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={fitbCount}
        onChangeText={setFitbCount}
      />

      <Text style={styles.label}>Free Response questions</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={frCount}
        onChangeText={setFrCount}
      />

      <Text style={styles.label}>Class name</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Biology 101"
        value={className}
        onChangeText={setClassName}
      />

      <Text style={styles.label}>Learning objectives</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        placeholder="What should this quiz emphasize?"
        value={learningObjectives}
        onChangeText={setLearningObjectives}
      />

      <Text style={styles.label}>Extra Instructions</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        placeholder="Example: Focus on key vocabulary, skip chapter 1, and ask more conceptual questions."
        value={extraPrompt}
        onChangeText={setExtraPrompt}
      />

      {error ? <Text style={styles.error}>{formatError(error)}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate Quiz</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 24, paddingBottom: 40 },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: "#666",
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 6,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  chipActive: { backgroundColor: "#4361ee" },
  chipText: { fontWeight: "600", color: "#333" },
  chipTextActive: { color: "#fff" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  error: {
    color: "#c0392b",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#4361ee",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
