import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

const flashLogo = require('../../assets/flash-logo.png');
import { colors, radius, shadows, spacing } from "../theme";

export default function DocumentActionScreen({ route, navigation }) {
  const { courseId, documentTitle } = route.params || {};
  const documentIds = route.params?.documentIds ?? (
    route.params?.documentId != null ? [route.params.documentId] : []
  );
  const primaryDocumentId = documentIds[0];
  const additionalDocumentIds = documentIds.slice(1);

  const [numCards, setNumCards] = useState("10");
  const [extraPrompt, setExtraPrompt] = useState("");

  const docLabel =
    documentIds.length > 1
      ? `Combining ${documentIds.length} documents`
      : documentTitle || "Your document is saved.";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={flashLogo} style={styles.heroLogo} resizeMode="contain" />
        <Text style={styles.heroTitle}>Study Material Ready</Text>
        <Text style={styles.heroSub}>{docLabel}</Text>
      </View>

      {/* Flashcards card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardEyebrow}>FLASHCARDS</Text>
          <Text style={styles.cardTitle}>Generate from this document</Text>
        </View>

        <Text style={styles.label}>Number of cards</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={numCards}
          onChangeText={setNumCards}
          placeholderTextColor={colors.fg3}
        />

        <Text style={styles.label}>Extra instructions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Example: focus on vocabulary, keep answers short, include formulas."
          placeholderTextColor={colors.fg3}
          value={extraPrompt}
          onChangeText={setExtraPrompt}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("Flashcards", {
              courseId,
              documentId: primaryDocumentId,
              additionalDocumentIds,
              documentTitle,
              numCards: parseInt(numCards, 10) || 10,
              extraPrompt,
            })
          }
        >
          <Text style={styles.primaryButtonText}>Generate Flashcards</Text>
        </TouchableOpacity>
      </View>

      {/* Quiz option */}
      <View style={styles.quizCard}>
        <View style={styles.quizCardLeft}>
          <Text style={styles.quizCardTitle}>Quiz</Text>
          <Text style={styles.quizCardSub}>Test your knowledge with AI-graded questions</Text>
        </View>
        <TouchableOpacity
          style={styles.quizBtn}
          onPress={() =>
            navigation.navigate("QuizConfig", {
              courseId,
              documentId: primaryDocumentId,
              additionalDocumentIds,
              documentTitle,
            })
          }
        >
          <Text style={styles.quizBtnText}>Configure Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 48 },

  hero: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  heroLogo: {
    width: 200,
    height: 72,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    backgroundColor: colors.surface,
    marginTop: 12,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.mid,
  },
  cardHeader: {
    marginBottom: spacing.base,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.fg1,
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

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    ...shadows.low,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },

  quizCard: {
    backgroundColor: colors.surface,
    marginTop: 12,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.low,
  },
  quizCardLeft: { flex: 1, marginRight: 12 },
  quizCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.fg1,
    marginBottom: 4,
  },
  quizCardSub: {
    fontSize: 13,
    color: colors.fg2,
    lineHeight: 18,
  },
  quizBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  quizBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
