import React, { useEffect, useState } from "react";
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

import { fetchQuiz, submitQuiz } from "../store/quizzesSlice";
import formatError from "../utils/formatError";

export default function QuizScreen({ route, navigation }) {
  const { quizId } = route.params;
  const dispatch = useDispatch();
  const { quiz, loading, error } = useSelector((state) => state.quizzes);
  const [answers, setAnswers] = useState({});

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
        <ActivityIndicator size="large" color="#4361ee" />
      </View>
    );
  }

  if (!quiz || quiz.id !== quizId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{formatError(error) || "Unable to load quiz."}</Text>
      </View>
    );
  }

  const questions = quiz.questions || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>
        Quiz - {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
      </Text>
      {error ? <Text style={styles.error}>{formatError(error)}</Text> : null}

      {questions.map((question, index) => (
        <View key={question.id} style={styles.questionBlock}>
          <Text style={styles.qNumber}>Question {index + 1}</Text>
          <Text style={styles.qText}>{question.question_text}</Text>

          {question.question_type === "mc" ? (
            question.answer_choices?.map((choice) => {
              const selected = answers[String(question.id)] === String(choice.id);
              return (
                <TouchableOpacity
                  key={choice.id}
                  style={[styles.choiceBtn, selected && styles.choiceSelected]}
                  onPress={() => setAnswer(question.id, String(choice.id))}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      selected && styles.choiceTextSelected,
                    ]}
                  >
                    {choice.choice_text}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <TextInput
              style={[
                styles.input,
                question.question_type === "free_response" && styles.longAnswer,
              ]}
              placeholder="Type your answer..."
              value={answers[String(question.id)] || ""}
              onChangeText={(text) => setAnswer(question.id, text)}
              multiline={question.question_type === "free_response"}
            />
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Quiz</Text>
        )}
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  error: {
    color: "#c0392b",
    marginBottom: 14,
  },
  questionBlock: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  qNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4361ee",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  qText: { fontSize: 16, color: "#1a1a2e", marginBottom: 12, lineHeight: 24 },
  choiceBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  choiceSelected: {
    borderColor: "#4361ee",
    backgroundColor: "#eef1ff",
  },
  choiceText: { color: "#333", fontSize: 15 },
  choiceTextSelected: { color: "#4361ee", fontWeight: "600" },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  longAnswer: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#4361ee",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  disabledButton: {
    opacity: 0.7,
  },
});
