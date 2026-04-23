import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { fetchCourseQuizHistory, retakeQuiz } from "../store/quizzesSlice";
import formatError from "../utils/formatError";

function ScoreBadge({ score }) {
  if (score == null) {
    return (
      <View style={[styles.badge, styles.badgeIncomplete]}>
        <Text style={styles.badgeText}>In progress</Text>
      </View>
    );
  }
  const color = score >= 80 ? "#2ecc71" : score >= 60 ? "#f39c12" : "#e74c3c";
  return (
    <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{score.toFixed(1)}%</Text>
    </View>
  );
}

// Compute which group_ids have more than one attempt so we know when to show version labels.
function buildGroupedHistory(history) {
  const groupCounts = {};
  history.forEach((quiz) => {
    if (quiz.group_id) {
      groupCounts[quiz.group_id] = (groupCounts[quiz.group_id] || 0) + 1;
    }
  });
  return history.map((quiz) => ({
    ...quiz,
    displayTitle:
      quiz.group_id && groupCounts[quiz.group_id] > 1
        ? `${quiz.document_title} v${quiz.attempt}`
        : quiz.document_title,
  }));
}

export default function QuizHistoryScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const dispatch = useDispatch();
  const { history, historyLoading, historyError, loading } = useSelector(
    (state) => state.quizzes
  );

  useEffect(() => {
    dispatch(fetchCourseQuizHistory(courseId));
  }, [dispatch, courseId]);

  const handlePress = (quiz) => {
    if (!quiz.completed_at) return;
    navigation.navigate("QuizResults", { quizId: quiz.id });
  };

  const handleRetake = (quiz) => {
    dispatch(retakeQuiz(quiz.id)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.navigate("Quiz", { quizId: action.payload.id });
      }
    });
  };

  const processedHistory = buildGroupedHistory(history || []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quiz History</Text>
      <Text style={styles.subtitle}>{courseName}</Text>

      {historyError ? (
        <Text style={styles.error}>{formatError(historyError)}</Text>
      ) : null}

      {historyLoading && (!history || history.length === 0) ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4361ee" />
        </View>
      ) : (
        <FlatList
          data={processedHistory}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            !history || history.length === 0 ? styles.emptyList : null,
            styles.list,
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePress(item)}
              disabled={!item.completed_at}
            >
              <View style={styles.cardRow}>
                <View style={styles.cardMain}>
                  <Text style={styles.docTitle} numberOfLines={2}>
                    {item.displayTitle}
                  </Text>
                  <Text style={styles.meta}>
                    {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                    {" · "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <ScoreBadge score={item.score} />
              </View>

              <View style={styles.cardFooter}>
                {item.completed_at ? (
                  <Text style={styles.tapHint}>Tap to review →</Text>
                ) : (
                  <View />
                )}
                <TouchableOpacity
                  style={[styles.retakeBtn, loading && styles.retakeBtnDisabled]}
                  accessibilityLabel={`Retake ${item.displayTitle}`}
                  onPress={() => handleRetake(item)}
                  disabled={loading}
                >
                  <Text style={styles.retakeBtnText}>Retake</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No quizzes yet. Generate a quiz from any document to get started.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    color: "#666",
    fontSize: 15,
  },
  error: {
    color: "#c0392b",
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 40,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
    color: "#7b8191",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardMain: {
    flex: 1,
    marginRight: 12,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
  },
  badge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeIncomplete: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  tapHint: {
    fontSize: 12,
    color: "#4361ee",
    fontWeight: "600",
  },
  retakeBtn: {
    backgroundColor: "#eef1ff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#c8d0f0",
  },
  retakeBtnDisabled: {
    opacity: 0.5,
  },
  retakeBtnText: {
    color: "#4361ee",
    fontWeight: "700",
    fontSize: 13,
  },
});
