import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DocumentActionScreen({ route, navigation }) {
  const { documentId, documentTitle } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Document Uploaded</Text>
      <Text style={styles.subtitle}>
        {documentTitle || "Your document is ready"}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Flashcards", {
            documentId,
            documentTitle,
          })
        }
      >
        <Text style={styles.buttonText}>Generate Flashcards</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("QuizConfig", {
            documentId,
            documentTitle,
          })
        }
      >
        <Text style={styles.buttonText}>Generate Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4361ee",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});