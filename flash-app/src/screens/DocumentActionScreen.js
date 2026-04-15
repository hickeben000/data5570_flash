import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DocumentActionScreen({ route, navigation }) {
  const { courseId, documentId, documentTitle } = route.params || {};
  const [numCards, setNumCards] = useState("10");
  const [extraPrompt, setExtraPrompt] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Material Ready</Text>
      <Text style={styles.subtitle}>
        {documentTitle || "Your document is saved. Choose what to generate next."}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Flashcards</Text>
        <Text style={styles.label}>Number of cards</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numCards}
          onChangeText={setNumCards}
        />

        <Text style={styles.label}>Extra instructions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Example: focus on vocabulary, keep answers short, include formulas."
          value={extraPrompt}
          onChangeText={setExtraPrompt}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("Flashcards", {
              courseId,
              documentId,
              documentTitle,
              numCards: parseInt(numCards, 10) || 10,
              extraPrompt,
            })
          }
        >
          <Text style={styles.primaryButtonText}>Generate Flashcards</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate("QuizConfig", {
            courseId,
            documentId,
            documentTitle,
          })
        }
      >
        <Text style={styles.secondaryButtonText}>Configure Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    color: "#666",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#4b5563",
  },
  input: {
    backgroundColor: "#f8f9fd",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dfe4f1",
    marginBottom: 14,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
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
  secondaryButton: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4361ee",
  },
  secondaryButtonText: {
    color: "#4361ee",
    fontWeight: "700",
    fontSize: 16,
  },
});
