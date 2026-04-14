import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { generateQuiz } from "../store/quizzesSlice";
import * as SecureStore from "expo-secure-store";

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function QuizConfigScreen({ route, navigation }) {
  const { documentId } = route.params;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.quizzes);

  const [difficulty, setDifficulty] = useState("medium");
  const [mcCount, setMcCount] = useState("2");
  const [fitbCount, setFitbCount] = useState("1");
  const [frCount, setFrCount] = useState("1");
  const [extraPrompt, setExtraPrompt] = useState("");

  // 🔥 NEW: Get API Key
  const getApiKey = async () => {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem("gemini_api_key");
      } else {
        return await SecureStore.getItemAsync("gemini_api_key");
      }
    } catch (error) {
      console.error("Error retrieving API key:", error);
      return null;
    }
  };

  const handleGenerate = async () => {
    // 🔥 STEP 1: Get API key
    const apiKey = await getApiKey();

    console.log("API KEY FROM SETTINGS:", apiKey);

    if (!apiKey) {
      alert("No API key found. Please add one in Settings.");
      return;
    }

    // 🔥 STEP 2: Continue existing flow
    dispatch(
      generateQuiz({
        documentId,
        difficulty,
        mc_count: parseInt(mcCount, 10) || 0,
        fitb_count: parseInt(fitbCount, 10) || 0,
        fr_count: parseInt(frCount, 10) || 0,
        extra_prompt: extraPrompt,
      })
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Quiz", { quizId: action.payload.id });
      }
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Configure Quiz</Text>

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.row}>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, difficulty === d && styles.chipActive]}
            onPress={() => setDifficulty(d)}
          >
            <Text
              style={[
                styles.chipText,
                difficulty === d && styles.chipTextActive,
              ]}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
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

      <Text style={styles.label}>Extra Instructions</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        placeholder="Example: Focus on key vocabulary, skip chapter 1, and ask more conceptual questions."
        value={extraPrompt}
        onChangeText={setExtraPrompt}
      />

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
    borderRadius: 10,
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
  button: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});