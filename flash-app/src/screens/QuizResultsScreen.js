import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchQuiz,
  fetchQuizAttempts,
  retakeQuiz,
  clearAttempts,
} from "../store/quizzesSlice";
import formatError from "../utils/formatError";

function getCorrectAnswerText(question) {
  if (question.question_type === "free_response") {
    return "Open-ended response graded by AI.";
  }
  const correctChoices = (question.answer_choices || [])
    .filter((choice) => choice.is_correct)
    .map((choice) => choice.choice_text);
  return correctChoices.join(", ") || "Not available";
}

function getUserAnswerText(question) {
  if (question.question_type === "mc") {
    const selectedChoice = (question.answer_choices || []).find(
      (choice) => String(choice.id) === String(question.user_answer)
    );
    return selectedChoice?.choice_text || "(no answer)";
  }
  return question.user_answer || "(no answer)";
}

function scoreColor(score) {
  if (score == null) return "#9ca3af";
  if (score >= 80) return "#27ae60";
  if (score >= 60) return "#d97706";
  return "#e74c3c";
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QuizResultsScreen({ route, navigation }) {
  const { quizId } = route.params;
  const dispatch = useDispatch();
  const { quiz, loading, error, attempts, attemptsLoading } = useSelector(
    (state) => state.quizzes
  );
  const [showAttempts, setShowAttempts] = useState(false);

  useEffect(() => {
    const hasLoadedResults =
      quiz &&
      quiz.id === quizId &&
      quiz.completed_at &&
      Array.isArray(quiz.questions);

    if (!hasLoadedResults) {
      dispatch(fetchQuiz(quizId));
    }
  }, [dispatch, quizId, quiz]);

  // Load attempt history when the section is opened.
  useEffect(() => {
    if (showAttempts) {
      dispatch(fetchQuizAttempts(quizId));
    } else {
      dispatch(clearAttempts());
    }
  }, [dispatch, quizId, showAttempts]);

  const handleRetake = () => {
    dispatch(retakeQuiz(quizId)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Quiz", { quizId });
      }
    });
  };

  if (loading && (!quiz || quiz.id !== quizId)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4361ee" />
      </View>
    );
  }

  if (!quiz || quiz.id !== quizId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{formatError(error) || "Unable to load results."}</Text>
      </View>
    );
  }

  const questions = quiz.questions || [];
  const isCompleted = !!quiz.completed_at;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Quiz Results</Text>

      {/* Score + metadata */}
      <View style={styles.scoreCard}>
        <Text style={[styles.score, { color: scoreColor(quiz.score) }]}>
          {quiz.score != null ? `${quiz.score.toFixed(1)}%` : "In Progress"}
        </Text>
        {quiz.class_name ? (
          <Text style={styles.metaText}>{quiz.class_name}</Text>
        ) : null}
        <Text style={styles.metaText}>
          {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)} ·{" "}
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </Text>
        {quiz.completed_at ? (
          <Text style={styles.metaText}>Completed {formatDate(quiz.completed_at)}</Text>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{formatError(error)}</Text> : null}

      {/* Retake button */}
      {isCompleted && (
        <TouchableOpacity
          style={[styles.retakeBtn, loading && styles.disabledBtn]}
          onPress={handleRetake}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#4361ee" />
          ) : (
            <Text style={styles.retakeBtnText}>↺  Retake Quiz</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Questions */}
      {questions.map((question, index) => (
        <View
          key={question.id}
          style={[
            styles.questionBlock,
            question.is_correct === true && styles.correct,
            question.is_correct === false && styles.incorrect,
            question.is_correct == null && styles.pending,
          ]}
        >
          <View style={styles.qHeader}>
            <Text style={styles.qNumber}>Question {index + 1}</Text>
            <Text style={styles.qTypeBadge}>
              {question.question_type === "mc"
                ? "Multiple Choice"
                : question.question_type === "fitb"
                ? "Fill in the Blank"
                : "Free Response"}
            </Text>
          </View>
          <Text style={styles.qText}>{question.question_text}</Text>

          <Text style={styles.answerLabel}>Your answer</Text>
          <Text style={styles.answerText}>{getUserAnswerText(question)}</Text>

          <Text style={styles.answerLabel}>Expected answer</Text>
          <Text style={styles.answerText}>{getCorrectAnswerText(question)}</Text>

          {question.feedback ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackLabel}>Feedback</Text>
              <Text style={styles.feedbackText}>{question.feedback}</Text>
            </View>
          ) : null}

          {question.explanation ? (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>Explanation</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
          ) : null}
        </View>
      ))}

      {/* Past attempts toggle */}
      <TouchableOpacity
        style={styles.attemptsToggle}
        onPress={() => setShowAttempts((v) => !v)}
      >
        <Text style={styles.attemptsToggleText}>
          {showAttempts ? "▲  Hide Past Attempts" : "▼  View Past Attempts"}
        </Text>
      </TouchableOpacity>

      {showAttempts && (
        <View style={styles.attemptsSection}>
          {attemptsLoading ? (
            <ActivityIndicator color="#4361ee" style={{ marginVertical: 12 }} />
          ) : attempts.length === 0 ? (
            <Text style={styles.noAttempts}>No past attempts recorded yet.</Text>
          ) : (
            attempts.map((attempt, idx) => (
              <View key={attempt.id} style={styles.attemptRow}>
                <View style={styles.attemptLeft}>
                  <Text style={styles.attemptNumber}>Attempt {attempts.length - idx}</Text>
                  <Text style={styles.attemptDate}>{formatDate(attempt.taken_at)}</Text>
                </View>
                <Text
                  style={[
                    styles.attemptScore,
                    { color: scoreColor(attempt.score) },
                  ]}
                >
                  {attempt.score != null ? `${attempt.score.toFixed(1)}%` : "—"}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 24, paddingBottom: 48 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  score: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  error: { color: "#c0392b", marginBottom: 12 },
  retakeBtn: {
    borderWidth: 2,
    borderColor: "#4361ee",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledBtn: { opacity: 0.6 },
  retakeBtnText: {
    color: "#4361ee",
    fontWeight: "700",
    fontSize: 16,
  },
  questionBlock: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  correct: { backgroundColor: "#eafaf1", borderLeftColor: "#2ecc71" },
  incorrect: { backgroundColor: "#fdf2f2", borderLeftColor: "#e74c3c" },
  pending: { backgroundColor: "#f3f4f6", borderLeftColor: "#9ca3af" },
  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  qNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4361ee",
    textTransform: "uppercase",
  },
  qTypeBadge: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "600",
  },
  qText: { fontSize: 16, color: "#1a1a2e", marginBottom: 12, lineHeight: 22 },
  answerLabel: { fontSize: 12, fontWeight: "700", color: "#6b7280", marginTop: 4 },
  answerText: { fontSize: 15, color: "#333", marginBottom: 4 },
  feedbackBox: {
    backgroundColor: "rgba(67,97,238,0.08)",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  feedbackLabel: { fontSize: 12, fontWeight: "700", color: "#4361ee", marginBottom: 4 },
  feedbackText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  explanationBox: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  explanationLabel: { fontSize: 12, fontWeight: "700", color: "#4361ee", marginBottom: 4 },
  explanationText: { fontSize: 14, color: "#555", lineHeight: 20 },
  attemptsToggle: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
  },
  attemptsToggleText: {
    color: "#4361ee",
    fontWeight: "700",
    fontSize: 15,
  },
  attemptsSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  noAttempts: { color: "#9ca3af", textAlign: "center", paddingVertical: 8 },
  attemptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  attemptLeft: {},
  attemptNumber: { fontWeight: "700", color: "#1a1a2e", fontSize: 14 },
  attemptDate: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  attemptScore: { fontSize: 20, fontWeight: "800" },
});
