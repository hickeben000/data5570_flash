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
import Card from "../components/Card";
import { fetchQuiz, submitQuiz } from "../store/quizzesSlice";

export default function QuizScreen({ route, navigation }) {
  const { quizId } = route.params;
  const dispatch = useDispatch();
  const { quiz, loading } = useSelector((state) => state.quizzes);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    dispatch(fetchQuiz(quizId));
  }, [dispatch, quizId]);

  const setAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    dispatch(submitQuiz({ quizId, answers })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("QuizResults", { quizId });
      }
    });
  };

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
      <Text style={styles.heading}>
        Quiz — {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
      </Text>

      {questions.map((q, idx) => (
        <View key={q.id} style={styles.questionBlock}>
          <Text style={styles.qNumber}>Question {idx + 1}</Text>
          <Text style={styles.qText}>{q.question_text}</Text>

          {q.question_type === "mc" && q.choices ? (
            q.choices.map((choice, ci) => (
              <TouchableOpacity
                key={ci}
                style={[
                  styles.choiceBtn,
                  answers[q.id] === choice && styles.choiceSelected,
                ]}
                onPress={() => setAnswer(q.id, choice)}
              >
                <Text
                  style={[
                    styles.choiceText,
                    answers[q.id] === choice && styles.choiceTextSelected,
                  ]}
                >
                  {choice}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Type your answer..."
              value={answers[q.id] || ""}
              onChangeText={(text) => setAnswer(q.id, text)}
              multiline={q.question_type === "free_response"}
            />
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>Submit Quiz</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  questionBlock: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  qNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4361ee",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  qText: { fontSize: 16, color: "#1a1a2e", marginBottom: 12, lineHeight: 22 },
  choiceBtn: {
    padding: 12,
    borderRadius: 8,
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
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  submitBtn: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
