import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuiz } from "../store/quizzesSlice";

export default function QuizResultsScreen({ route }) {
  const { quizId } = route.params;
  const dispatch = useDispatch();
  const { quiz, loading } = useSelector((state) => state.quizzes);

  useEffect(() => {
    if (!quiz || quiz.id !== quizId) {
      dispatch(fetchQuiz(quizId));
    }
  }, [dispatch, quizId, quiz]);

  if (loading || !quiz) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4361ee" />
      </View>
    );
  }

  const questions = quiz.questions || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Quiz Results</Text>
      <Text style={styles.score}>
        Score: {quiz.score != null ? `${quiz.score.toFixed(1)}%` : "N/A"}
      </Text>

      {questions.map((q, idx) => (
        <View
          key={q.id}
          style={[
            styles.questionBlock,
            q.is_correct ? styles.correct : styles.incorrect,
          ]}
        >
          <Text style={styles.qNumber}>Question {idx + 1}</Text>
          <Text style={styles.qText}>{q.question_text}</Text>

          <Text style={styles.answerLabel}>Your answer:</Text>
          <Text style={styles.answerText}>{q.user_answer || "(no answer)"}</Text>

          <Text style={styles.answerLabel}>Correct answer:</Text>
          <Text style={styles.answerText}>{q.correct_answer}</Text>

          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>Explanation</Text>
            <Text style={styles.explanationText}>{q.explanation}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4361ee",
    textAlign: "center",
    marginBottom: 24,
  },
  questionBlock: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  correct: {
    backgroundColor: "#eafaf1",
    borderLeftColor: "#2ecc71",
  },
  incorrect: {
    backgroundColor: "#fdf2f2",
    borderLeftColor: "#e74c3c",
  },
  qNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4361ee",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  qText: { fontSize: 16, color: "#1a1a2e", marginBottom: 12, lineHeight: 22 },
  answerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    marginTop: 4,
  },
  answerText: { fontSize: 15, color: "#333", marginBottom: 4 },
  explanationBox: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  explanationLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4361ee",
    marginBottom: 4,
  },
  explanationText: { fontSize: 14, color: "#555", lineHeight: 20 },
});
