import React, { useState } from "react";
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

import { generateQuiz } from "../store/quizzesSlice";
import { colors, radius, shadows, spacing } from "../theme";
import formatError from "../utils/formatError";

const DIFFICULTIES = ["easy", "medium", "hard"];

const DIFF_COLORS = {
  easy: { bg: '#e8f8ef', border: '#27ae60', text: '#16a34a', activeBg: '#16a34a' },
  medium: { bg: '#fef3c7', border: '#d97706', text: '#b45309', activeBg: '#d97706' },
  hard: { bg: '#fee2e2', border: '#ef4444', text: '#dc2626', activeBg: '#ef4444' },
};

export default function QuizConfigScreen({ route, navigation }) {
  const { documentId, additionalDocumentIds = [] } = route.params;
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.quizzes);

  const [difficulty, setDifficulty] = useState("medium");
  const [mcCount, setMcCount] = useState("2");
  const [fitbCount, setFitbCount] = useState("1");
  const [frCount, setFrCount] = useState("1");
  const [className, setClassName] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [extraPrompt, setExtraPrompt] = useState("");

  const handleGenerate = () => {
    dispatch(
      generateQuiz({
        documentId,
        additionalDocumentIds,
        difficulty,
        mc_count: parseInt(mcCount, 10) || 0,
        fitb_count: parseInt(fitbCount, 10) || 0,
        fr_count: parseInt(frCount, 10) || 0,
        class_name: className.trim(),
        learning_objectives: learningObjectives.trim(),
        extra_prompt: extraPrompt.trim(),
      })
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Quiz", { quizId: action.payload.id });
      }
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Configure Quiz</Text>
        <Text style={styles.subtitle}>
          Your OpenAI key stays on-device and is only sent with AI-backed quiz requests.
        </Text>
      </View>

      {/* Difficulty */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>DIFFICULTY</Text>
        <View style={styles.chipRow}>
          {DIFFICULTIES.map((level) => {
            const dc = DIFF_COLORS[level];
            const active = difficulty === level;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.diffChip,
                  active
                    ? { backgroundColor: dc.activeBg, borderColor: dc.activeBg }
                    : { backgroundColor: dc.bg, borderColor: dc.border },
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={[styles.diffChipText, { color: active ? '#fff' : dc.text }]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Question counts */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>QUESTION COUNTS</Text>
        <View style={styles.countRow}>
          <View style={styles.countField}>
            <Text style={styles.label}>Multiple Choice questions</Text>
            <TextInput
              style={styles.countInput}
              keyboardType="numeric"
              value={mcCount}
              onChangeText={setMcCount}
            />
          </View>
          <View style={styles.countField}>
            <Text style={styles.label}>Fill in the Blank questions</Text>
            <TextInput
              style={styles.countInput}
              keyboardType="numeric"
              value={fitbCount}
              onChangeText={setFitbCount}
            />
          </View>
          <View style={styles.countField}>
            <Text style={styles.label}>Free Response questions</Text>
            <TextInput
              style={styles.countInput}
              keyboardType="numeric"
              value={frCount}
              onChangeText={setFrCount}
            />
          </View>
        </View>
      </View>

      {/* Context */}
      <View style={styles.section}>
        <Text style={styles.sectionEyebrow}>CONTEXT (OPTIONAL)</Text>
        <Text style={styles.label}>Class name</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Biology 101"
          placeholderTextColor={colors.fg3}
          value={className}
          onChangeText={setClassName}
        />

        <Text style={styles.label}>Learning objectives</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="What should this quiz emphasize?"
          placeholderTextColor={colors.fg3}
          value={learningObjectives}
          onChangeText={setLearningObjectives}
        />

        <Text style={styles.label}>Extra Instructions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Example: Focus on key vocabulary, skip chapter 1, and ask more conceptual questions."
          placeholderTextColor={colors.fg3}
          value={extraPrompt}
          onChangeText={setExtraPrompt}
        />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{formatError(error)}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.generateBtn, loading && styles.generateBtnDisabled]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateBtnText}>Generate Quiz</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 48 },

  header: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },

  section: {
    backgroundColor: colors.surface,
    marginTop: 12,
    padding: spacing.xl,
    ...shadows.low,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  diffChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  diffChipText: {
    fontWeight: '700',
    fontSize: 14,
  },

  countRow: {
    gap: 12,
  },
  countField: {
    flex: 1,
  },
  countInput: {
    backgroundColor: colors.surfaceInset,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 16,
    color: colors.fg1,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.fg2,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.surfaceInset,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 15,
    color: colors.fg1,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  errorBox: {
    marginHorizontal: spacing.xl,
    marginTop: 12,
    backgroundColor: colors.errorBg,
    borderRadius: radius.md,
    padding: 14,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: 14,
    fontWeight: '600',
  },

  generateBtn: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    ...shadows.mid,
  },
  generateBtnDisabled: { opacity: 0.7 },
  generateBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
