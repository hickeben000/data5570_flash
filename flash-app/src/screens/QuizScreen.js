import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { fetchQuiz, submitQuiz } from "../store/quizzesSlice";
import formatError from "../utils/formatError";
import { colors, radius, shadows } from "../theme";

const isWeb = Platform.OS === "web";

const CHOICE_LETTERS = ["A", "B", "C", "D", "E"];

export default function QuizScreen({ route, navigation }) {
  const { quizId } = route.params;
  const dispatch = useDispatch();
  const { quiz, loading, error } = useSelector((state) => state.quizzes);
  const [answers, setAnswers] = useState({});
  const [activeQ, setActiveQ] = useState(0);

  useEffect(() => {
    dispatch(fetchQuiz(quizId));
  }, [dispatch, quizId]);

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  const handleSubmit = () => {
    dispatch(submitQuiz({ quizId, answers })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("QuizResults", { quizId });
      }
    });
  };

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
          {formatError(error) || "Unable to load quiz."}
        </Text>
      </View>
    );
  }

  const questions = quiz.questions || [];
  const answered = Object.keys(answers).length;
  const progress = questions.length ? (answered / questions.length) * 100 : 0;

  const difficulty =
    quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1);

  if (isWeb) {
    // Web: sidebar question list + main content area
    return (
      <View style={styles.webContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backIconBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIconText}>←</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.quizTitle}>
                Quiz — {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
              </Text>
              <Text style={styles.quizMeta}>
                {answered} of {questions.length} answered
              </Text>
            </View>
          </View>
          <View style={styles.diffBadge}>
            <Text style={styles.diffBadgeText}>{difficulty}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {/* Body */}
        <View style={styles.webBody}>
          {/* Sidebar */}
          <View style={styles.webSidebar}>
            <Text style={styles.sidebarLabel}>QUESTIONS</Text>
            {questions.map((q, i) => {
              const isDone = answers[String(q.id)] !== undefined;
              const isActive = activeQ === i;
              return (
                <TouchableOpacity
                  key={q.id}
                  style={[
                    styles.qPill,
                    isActive && styles.qPillActive,
                  ]}
                  onPress={() => setActiveQ(i)}
                >
                  <View
                    style={[
                      styles.qPillNum,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : isDone
                          ? colors.success
                          : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.qPillNumText,
                        { color: isActive || isDone ? "#fff" : colors.fg3 },
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.qPillText,
                      { color: isActive ? colors.primary : colors.fg2 },
                    ]}
                    numberOfLines={1}
                  >
                    Question {i + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Quiz</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Main question area */}
          <ScrollView style={styles.webMain} contentContainerStyle={styles.webMainContent}>
            {questions.map((q, i) =>
              i === activeQ ? (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  total={questions.length}
                  answer={answers[String(q.id)]}
                  onAnswer={(val) => {
                    setAnswer(q.id, val);
                    if (i < questions.length - 1)
                      setTimeout(() => setActiveQ(i + 1), 300);
                  }}
                  onPrev={i > 0 ? () => setActiveQ(i - 1) : null}
                  onNext={i < questions.length - 1 ? () => setActiveQ(i + 1) : null}
                />
              ) : null
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Mobile: scrollable questions
  return (
    <ScrollView style={styles.mobileContainer} contentContainerStyle={styles.mobileContent}>
      {/* Header */}
      <View style={styles.mobileHeader}>
        <Text style={styles.quizTitle}>
          Quiz — {difficulty}
        </Text>
        <Text style={styles.quizMeta}>
          {answered} of {questions.length} answered
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {error ? <Text style={styles.errorText}>{formatError(error)}</Text> : null}

      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          total={questions.length}
          answer={answers[String(q.id)]}
          onAnswer={(val) => setAnswer(q.id, val)}
          onPrev={null}
          onNext={null}
          compact
        />
      ))}

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>Submit Quiz</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function QuestionCard({ question, index, total, answer, onAnswer, onPrev, onNext, compact }) {
  return (
    <View style={[styles.qCard, compact && styles.qCardCompact]}>
      <Text style={styles.qEyebrow}>
        Question {index + 1} of {total}
      </Text>
      <Text style={styles.qText}>{question.question_text}</Text>

      {question.question_type === "mc" ? (
        <View style={styles.choices}>
          {question.answer_choices?.map((choice, ci) => {
            const sel = String(answer) === String(choice.id);
            return (
              <TouchableOpacity
                key={choice.id}
                style={[styles.choice, sel && styles.choiceSel]}
                onPress={() => onAnswer(String(choice.id))}
              >
                <View style={[styles.choiceLetter, sel && styles.choiceLetterSel]}>
                  <Text style={[styles.choiceLetterText, { color: sel ? "#fff" : colors.fg3 }]}>
                    {CHOICE_LETTERS[ci] || ci + 1}
                  </Text>
                </View>
                <Text style={[styles.choiceText, sel && styles.choiceTextSel]}>
                  {choice.choice_text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <TextInput
          style={styles.textarea}
          placeholder="Type your answer..."
          placeholderTextColor={colors.fg3}
          value={answer || ""}
          onChangeText={onAnswer}
          multiline={question.question_type === "free_response"}
        />
      )}

      {(onPrev || onNext) && (
        <View style={styles.qNav}>
          {onPrev && (
            <TouchableOpacity style={styles.qNavBtn} onPress={onPrev}>
              <Text style={styles.qNavBtnText}>← Previous</Text>
            </TouchableOpacity>
          )}
          {onNext && (
            <TouchableOpacity
              style={[styles.qNavBtn, styles.qNavBtnNext]}
              onPress={onNext}
            >
              <Text style={[styles.qNavBtnText, { color: "#fff" }]}>Next →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.bg,
  },
  errorText: {
    color: colors.errorDark,
    textAlign: "center",
    fontSize: 14,
    marginBottom: 14,
  },

  // Web layout
  webContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingHorizontal: 32,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backIconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  backIconText: {
    fontSize: 18,
    color: "#374151",
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.fg1,
  },
  quizMeta: {
    fontSize: 12,
    color: colors.fg3,
    marginTop: 2,
  },
  diffBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  diffBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  webBody: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  webSidebar: {
    width: 220,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    overflowY: "auto",
  },
  sidebarLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.fg3,
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 6,
  },
  qPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  qPillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: "#c7d2fe",
  },
  qPillNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  qPillNumText: {
    fontSize: 11,
    fontWeight: "700",
  },
  qPillText: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  webMain: {
    flex: 1,
    overflowY: "auto",
  },
  webMainContent: {
    padding: 40,
  },

  // Mobile layout
  mobileContainer: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  mobileContent: {
    padding: 20,
    paddingBottom: 40,
  },
  mobileHeader: {
    marginBottom: 16,
  },

  // Question card
  qCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    paddingHorizontal: 32,
    ...shadows.mid,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 680,
  },
  qCardCompact: {
    borderRadius: radius.lg,
    padding: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
    maxWidth: undefined,
  },
  qEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  qText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.fg1,
    lineHeight: 30,
    marginBottom: 24,
  },
  choices: {
    gap: 10,
  },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: "#fff",
  },
  choiceSel: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  choiceLetter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  choiceLetterSel: {
    backgroundColor: colors.primary,
  },
  choiceLetterText: {
    fontSize: 13,
    fontWeight: "800",
  },
  choiceText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },
  choiceTextSel: {
    color: colors.primary,
    fontWeight: "600",
  },
  textarea: {
    backgroundColor: colors.surfaceInset,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    fontSize: 15,
    color: colors.fg1,
    minHeight: 120,
    textAlignVertical: "top",
  },
  qNav: {
    flexDirection: "row",
    marginTop: 24,
    gap: 10,
  },
  qNavBtn: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: "#fff",
  },
  qNavBtnNext: {
    marginLeft: "auto",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  qNavBtnText: {
    fontWeight: "700",
    fontSize: 13,
    color: colors.fg2,
  },

  // Submit button
  submitBtn: {
    marginTop: "auto",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    ...shadows.mid,
    marginTop: 16,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});
