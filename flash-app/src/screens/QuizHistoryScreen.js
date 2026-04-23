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
import { colors, radius, shadows, spacing } from "../theme";
import formatError from "../utils/formatError";

function ScoreBadge({ score }) {
  if (score == null) {
    return (
      <View style={[styles.badge, styles.badgeIncomplete]}>
        <Text style={[styles.badgeText, { color: colors.fg3 }]}>In progress</Text>
      </View>
    );
  }
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';
  const bgColor = score >= 80 ? '#e8f8ef' : score >= 60 ? '#fef3c7' : '#fee2e2';
  return (
    <View style={[styles.badge, { backgroundColor: bgColor, borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{score.toFixed(1)}%</Text>
    </View>
  );
}

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

const DIFF_COLORS = {
  easy: '#16a34a',
  medium: '#d97706',
  hard: '#dc2626',
};

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Quiz History</Text>
        <Text style={styles.headerSub}>{courseName}</Text>
      </View>

      {historyError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{formatError(historyError)}</Text>
        </View>
      ) : null}

      {historyLoading && (!history || history.length === 0) ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={processedHistory}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            (!history || history.length === 0) ? styles.emptyList : null,
            styles.list,
          ]}
          renderItem={({ item }) => {
            const diffColor = DIFF_COLORS[item.difficulty] || colors.fg2;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handlePress(item)}
                disabled={!item.completed_at}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardMain}>
                    <Text style={styles.docTitle} numberOfLines={2}>
                      {item.displayTitle}
                    </Text>
                    <View style={styles.metaRow}>
                      <View style={[styles.diffPill, { backgroundColor: diffColor + '22', borderColor: diffColor }]}>
                        <Text style={[styles.diffPillText, { color: diffColor }]}>
                          {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                        </Text>
                      </View>
                      <Text style={styles.metaDate}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>
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
            );
          }}
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
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },

  errorBox: {
    margin: spacing.lg,
    backgroundColor: colors.errorBg,
    borderRadius: radius.md,
    padding: 14,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: 14,
    fontWeight: '600',
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  list: { padding: spacing.lg, paddingBottom: 40 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  empty: {
    textAlign: 'center',
    color: colors.fg3,
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: 12,
    ...shadows.low,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardMain: { flex: 1, marginRight: 12 },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.fg1,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diffPill: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  diffPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaDate: {
    fontSize: 12,
    color: colors.fg3,
  },

  badge: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    minWidth: 64,
    alignItems: 'center',
  },
  badgeIncomplete: {
    backgroundColor: colors.surfaceInset,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  tapHint: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  retakeBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retakeBtnDisabled: { opacity: 0.5 },
  retakeBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
