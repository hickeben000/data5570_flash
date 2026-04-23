import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

import { fetchQuiz, retakeQuiz } from "../store/quizzesSlice";
import formatError from "../utils/formatError";
import { colors, radius, shadows } from "../theme";

const isWeb = Platform.OS === "web";

function getCorrectAnswerText(question) {
  if (question.question_type === "free_response") {
    return "Open-ended response graded by AI.";
  }
  const correctChoices = (question.answer_choices || [])
    .filter((c) => c.is_correct)
    .map((c) => c.choice_text);
  return correctChoices.join(", ") || "Not available";
}

function getUserAnswerText(question) {
  if (question.question_type === "mc") {
    const sel = (question.answer_choices || []).find(
      (c) => String(c.id) === String(question.user_answer)
    );
    return sel?.choice_text || "(no answer)";
  }
  return question.user_answer || "(no answer)";
}

export default function QuizResultsScreen({ route, navigation }) {
  const { quizId } = route.params;
  const dispatch = useDispatch();
  const { quiz, loading, error } = useSelector((state) => state.quizzes);

  const handleRetake = () => {
    dispatch(retakeQuiz(quizId)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Quiz", { quizId: action.payload.id });
      }
    });
  };

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

  if (loading && (!quiz || quiz.id !== quizId)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!quiz || quiz.id !== quizId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {formatError(error) || "Unable to load results."}
        </Text>
      </View>
    );
  }

  const questions = quiz.questions || [];
  const score = quiz.score != null ? quiz.score.toFixed(1) : null;
  const pct = score ? parseFloat(score) : 0;
  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const gradeColor =
    pct >= 80 ? colors.success : pct >= 60 ? colors.warning : colors.error;
  const heroTitle =
    pct >= 80 ? "Great work!" : pct >= 60 ? "Good effort!" : "Keep studying!";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <LinearGradient
        colors={["#1a56db", "#1560F0", "#2B7FFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Grade circle */}
        <View style={styles.gradeCircle}>
          <Text style={[styles.grade, { color: gradeColor }]}>{grade}</Text>
          <Text style={styles.pctText}>{score != null ? `${score}%` : "N/A"}</Text>
        </View>

        <Text style={styles.heroTitle}>{heroTitle}</Text>
        {error ? (
          <Text style={styles.errorText}>{formatError(error)}</Text>
        ) : null}

        {/* Stats */}
        {score != null && (
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: colors.success }]}>
                {Math.round(pct)}%
              </Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: "#fff" }]}>
                {grade}
              </Text>
              <Text style={styles.statLabel}>Grade</Text>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={handleRetake}
            disabled={loading}
            accessibilityLabel="Retake Quiz"
          >
            {loading ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Text style={styles.retakeBtnText}>Retake Quiz</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Back to Course</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quiz Results title */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Quiz Results</Text>

        {questions.map((q, i) => {
          const isCorrect = q.is_correct;
          const isOpen = q.question_type === "free_response";
          return (
            <View
              key={q.id}
              style={[
                styles.reviewCard,
                {
                  borderLeftColor: isOpen
                    ? colors.primary
                    : isCorrect
                    ? colors.success
                    : colors.error,
                },
              ]}
            >
              <View style={styles.reviewHeader}>
                <View
                  style={[
                    styles.reviewBadge,
                    {
                      backgroundColor: isOpen
                        ? colors.primaryLight
                        : isCorrect
                        ? "#dcfce7"
                        : "#fee2e2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.reviewBadgeText,
                      {
                        color: isOpen
                          ? colors.primary
                          : isCorrect
                          ? colors.successDark
                          : colors.errorDark,
                      },
                    ]}
                  >
                    {isOpen ? "Open Answer" : isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </Text>
                </View>
                <Text style={styles.reviewQNum}>Q{i + 1}</Text>
              </View>
              <Text style={styles.reviewQText}>{q.question_text}</Text>

              <Text style={styles.answerLabel}>Your answer</Text>
              <Text style={styles.answerText}>{getUserAnswerText(q)}</Text>

              {!isOpen && (
                <>
                  <Text style={styles.answerLabel}>Expected answer</Text>
                  <Text style={styles.answerText}>{getCorrectAnswerText(q)}</Text>
                </>
              )}

              {q.feedback ? (
                <View style={styles.feedbackBox}>
                  <Text style={styles.feedbackLabel}>Feedback</Text>
                  <Text style={styles.feedbackText}>{q.feedback}</Text>
                </View>
              ) : null}

              {q.explanation ? (
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationLabel}>Explanation</Text>
                  <Text style={styles.explanationText}>{q.explanation}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.bg,
  },
  errorText: {
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 8,
  },
  hero: {
    padding: isWeb ? 56 : 36,
    paddingTop: isWeb ? 56 : 52,
    alignItems: "center",
    gap: 16,
  },
  gradeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  grade: {
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 40,
  },
  pctText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.lg,
    padding: 14,
    paddingHorizontal: 32,
  },
  stat: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statVal: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  retakeBtn: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    paddingHorizontal: 28,
    paddingVertical: 12,
    ...shadows.mid,
  },
  retakeBtnText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  backBtn: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: radius.lg,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  reviewSection: {
    padding: isWeb ? 40 : 20,
    maxWidth: isWeb ? 760 : undefined,
    alignSelf: isWeb ? "center" : undefined,
    width: "100%",
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.fg1,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...shadows.low,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reviewBadge: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  reviewBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  reviewQNum: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.fg3,
  },
  reviewQText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.fg1,
    lineHeight: 22,
    marginBottom: 12,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.fg2,
    marginTop: 4,
    marginBottom: 2,
  },
  answerText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  feedbackBox: {
    backgroundColor: "rgba(67,97,238,0.08)",
    borderRadius: radius.md,
    padding: 12,
    marginTop: 10,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  feedbackText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  explanationBox: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: radius.md,
    padding: 12,
    marginTop: 10,
  },
  explanationLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  explanationText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
