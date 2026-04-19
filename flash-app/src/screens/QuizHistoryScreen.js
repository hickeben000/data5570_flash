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
import { fetchUserQuizzes } from "../store/quizzesSlice";
import formatError from "../utils/formatError";

function difficultyColor(difficulty) {
  if (difficulty === "easy") return "#27ae60";
  if (difficulty === "hard") return "#e74c3c";
  return "#d97706";
}

function scoreColor(score) {
  if (score == null) return "#9ca3af";
  if (score >= 80) return "#27ae60";
  if (score >= 60) return "#d97706";
  return "#e74c3c";
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function QuizHistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { userQuizzes, loading, error } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchUserQuizzes());
  }, [dispatch]);

  if (loading && userQuizzes.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={styles.loadingText}>Loading quizzes...</Text>
      </View>
    );
  }

  if (error && userQuizzes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{formatError(error)}</Text>
      </View>
    );
  }

  if (userQuizzes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No quizzes yet</Text>
        <Text style={styles.emptySubtitle}>
          Generate a quiz from any document to see it here.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const taken = item.completed_at != null;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("QuizResults", { quizId: item.id })
        }
        activeOpacity={0.85}
      >
        <View style={styles.cardTop}>
          <Text style={styles.docTitle} numberOfLines={1}>
            {item.document_title || "Untitled Document"}
          </Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColor(item.difficulty) + "22" },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: difficultyColor(item.difficulty) },
              ]}
            >
              {item.difficulty?.charAt(0).toUpperCase() + item.difficulty?.slice(1)}
            </Text>
          </View>
        </View>

        {item.class_name ? (
          <Text style={styles.className}>{item.class_name}</Text>
        ) : null}

        <View style={styles.cardBottom}>
          <View style={styles.metaGroup}>
            <Text style={styles.metaLabel}>
              {taken ? "Best score" : "Not taken"}
            </Text>
            {taken && (
              <Text style={[styles.scoreText, { color: scoreColor(item.score) }]}>
                {item.score != null ? `${item.score.toFixed(1)}%` : "—"}
              </Text>
            )}
          </View>

          <View style={styles.metaGroup}>
            <Text style={styles.metaLabel}>Attempts</Text>
            <Text style={styles.metaValue}>{item.attempt_count}</Text>
          </View>

          <View style={styles.metaGroup}>
            <Text style={styles.metaLabel}>Created</Text>
            <Text style={styles.metaValue}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={userQuizzes}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListHeaderComponent={
        <Text style={styles.heading}>My Quizzes</Text>
      }
      onRefresh={() => dispatch(fetchUserQuizzes())}
      refreshing={loading}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb" },
  content: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f5f7fb",
  },
  loadingText: { marginTop: 12, color: "#666" },
  error: { color: "#c0392b", textAlign: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a2e", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  docTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginRight: 8,
  },
  difficultyBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  difficultyText: { fontSize: 12, fontWeight: "700" },
  className: { fontSize: 13, color: "#4361ee", marginBottom: 12, marginTop: 2 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  metaGroup: { alignItems: "center" },
  metaLabel: { fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 2 },
  scoreText: { fontSize: 18, fontWeight: "800" },
  metaValue: { fontSize: 14, fontWeight: "700", color: "#374151" },
});
