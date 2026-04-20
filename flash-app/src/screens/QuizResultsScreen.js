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

import { cloneQuiz, fetchQuiz, generateQuiz } from "../store/quizzesSlice";
import formatError from "../utils/formatError";
import { buildWeakAreaExtraPrompt, countQuestionTypes } from "../utils/quizFollowUp";

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

export default function QuizResultsScreen({ route, navigation }) {
  const { quizId } = route.params;
  const dispatch = useDispatch();
  const { quiz, loading, error } = useSelector((state) => state.quizzes);
  const [pinnedResult, setPinnedResult] = useState(null);
  const [followUp, setFollowUp] = useState(null);

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

  useEffect(() => {
    if (
      quiz &&
      quiz.id === quizId &&
      quiz.completed_at &&
      Array.isArray(quiz.questions)
    ) {
      setPinnedResult(quiz);
    }
  }, [quiz, quizId]);

  const effectiveQuiz =
    pinnedResult?.id === quizId
      ? pinnedResult
      : quiz?.id === quizId && quiz?.completed_at
        ? quiz
        : null;

  const handleRetakeSame = () => {
    setFollowUp("clone");
    dispatch(cloneQuiz(quizId)).then((action) => {
      setFollowUp(null);
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Quiz", { quizId: action.payload.id });
      }
    });
  };

  const handleWeakAreas = () => {
    const q = effectiveQuiz;
    if (!q) {
      return;
    }
    const { mc_count, fitb_count, fr_count } = countQuestionTypes(q.questions);
    if (mc_count + fitb_count + fr_count <= 0) {
      return;
    }
    setFollowUp("weak");
    dispatch(
      generateQuiz({
        documentId: q.document,
        additionalDocumentIds: [],
        difficulty: q.difficulty,
        mc_count,
        fitb_count,
        fr_count,
        class_name: q.class_name || "",
        learning_objectives: q.learning_objectives || "",
        extra_prompt: buildWeakAreaExtraPrompt(q.questions),
      })
    ).then((action) => {
      setFollowUp(null);
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Quiz", { quizId: action.payload.id });
      }
    });
  };

  if (loading && (!effectiveQuiz || effectiveQuiz.id !== quizId)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4361ee" />
      </View>
    );
  }

  if (!effectiveQuiz || effectiveQuiz.id !== quizId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{formatError(error) || "Unable to load results."}</Text>
      </View>
    );
  }

  const questions = effectiveQuiz.questions || [];
  const busyClone = followUp === "clone";
  const busyWeak = followUp === "weak";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Quiz Results</Text>
      <Text style={styles.score}>
        Score: {effectiveQuiz.score != null ? `${effectiveQuiz.score.toFixed(1)}%` : "N/A"}
      </Text>
      {error ? <Text style={styles.error}>{formatError(error)}</Text> : null}

      <View style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>What&apos;s next?</Text>
        <TouchableOpacity
          style={[styles.primaryBtn, (busyClone || busyWeak) && styles.btnDisabled]}
          onPress={handleRetakeSame}
          disabled={!!followUp}
        >
          {busyClone ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Retake same quiz</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.actionsHint}>
          New attempt with the same questions; your previous score stays in history.
        </Text>

        <TouchableOpacity
          style={[styles.secondaryBtn, (busyClone || busyWeak) && styles.btnDisabled]}
          onPress={handleWeakAreas}
          disabled={!!followUp}
        >
          {busyWeak ? (
            <ActivityIndicator color="#4361ee" />
          ) : (
            <Text style={styles.secondaryBtnText}>New quiz — focus on weak areas</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.actionsHint}>
          Generates new questions on the same document, guided by what you missed.
        </Text>
      </View>

      {questions.map((question, index) => (
        <View
          key={question.id}
          style={[
            styles.questionBlock,
            question.is_correct ? styles.correct : styles.incorrect,
          ]}
        >
          <Text style={styles.qNumber}>Question {index + 1}</Text>
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

          <View style={styles.explanationBox}>
            <Text style={styles.explanationLabel}>Explanation</Text>
            <Text style={styles.explanationText}>
              {question.explanation || "No explanation was returned."}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 24, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4361ee",
    textAlign: "center",
    marginBottom: 16,
  },
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: "#eef1ff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  secondaryBtnText: { color: "#4361ee", fontWeight: "700", fontSize: 16 },
  btnDisabled: { opacity: 0.65 },
  actionsHint: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 4,
  },
  error: {
    color: "#c0392b",
    marginBottom: 12,
  },
  questionBlock: {
    borderRadius: 14,
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
    color: "#6b7280",
    marginTop: 4,
  },
  answerText: { fontSize: 15, color: "#333", marginBottom: 4 },
  feedbackBox: {
    backgroundColor: "rgba(67,97,238,0.08)",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4361ee",
    marginBottom: 4,
  },
  feedbackText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  explanationBox: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
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
