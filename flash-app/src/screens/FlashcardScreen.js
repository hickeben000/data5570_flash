import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

import {
  clearFlashcardsError,
  fetchDeck,
  generateFlashcards,
  updateCardStatus,
} from "../store/flashcardsSlice";
import formatError from "../utils/formatError";
import { colors, radius, shadows } from "../theme";

const isWeb = Platform.OS === "web";

export default function FlashcardScreen({ route, navigation }) {
  const {
    deckId,
    documentId,
    additionalDocumentIds = [],
    numCards = 10,
    extraPrompt = "",
  } = route.params || {};
  const dispatch = useDispatch();
  const { deck, loading, error } = useSelector((state) => state.flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    dispatch(clearFlashcardsError());
    if (deckId) {
      dispatch(fetchDeck(deckId));
    } else if (documentId) {
      dispatch(
        generateFlashcards({
          documentId,
          additionalDocumentIds,
          numCards,
          extraPrompt,
        })
      );
    }
    setCurrentIndex(0);
    setFlipped(false);
  }, [dispatch, deckId, documentId]);

  if (loading && !deck) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.centerBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.centerBackText}>← Back</Text>
        </TouchableOpacity>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Generating flashcards...</Text>
      </View>
    );
  }

  if (error && !deck) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.centerBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.centerBackText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>{formatError(error)}</Text>
      </View>
    );
  }

  const cards = deck?.cards || [];
  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.centerBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.centerBackText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.emptyText}>No flashcards available yet.</Text>
      </View>
    );
  }

  const card = cards[currentIndex];
  const knownCount = Object.values(statuses).filter((s) => s === "known").length;
  const reviewCount = Object.values(statuses).filter((s) => s === "review").length;
  const progress = (currentIndex / cards.length) * 100;

  const goNext = () => {
    setFlipped(false);
    setTimeout(
      () => setCurrentIndex((prev) => (prev + 1) % cards.length),
      isWeb ? 0 : 100
    );
  };

  const goPrev = () => {
    setFlipped(false);
    setTimeout(
      () =>
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length),
      isWeb ? 0 : 100
    );
  };

  const markCard = (status) => {
    dispatch(updateCardStatus({ cardId: card.id, status }));
    setStatuses((s) => ({ ...s, [card.id]: status }));
    goNext();
  };

  const allDone =
    Object.keys(statuses).length === cards.length && cards.length > 0;

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.topMeta}>
          <Text style={styles.deckTitle} numberOfLines={1}>
            {deck?.title || "Flashcards"}
          </Text>
          <Text style={styles.counter}>
            {currentIndex + 1}{" "}
            <Text style={styles.counterTotal}>/ {cards.length}</Text>
          </Text>
        </View>
        <View style={styles.topStats}>
          <Text style={styles.knownStat}>✓ {knownCount}</Text>
          <Text style={styles.reviewStat}>↩ {reviewCount}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Card area */}
      <View style={styles.cardArea}>
        {allDone ? (
          <View style={styles.doneCard}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <Text style={styles.doneTitle}>Deck Complete!</Text>
            <Text style={styles.doneSub}>
              {knownCount} of {cards.length} cards marked as known.
            </Text>
            <TouchableOpacity
              style={styles.restartBtn}
              onPress={() => {
                setStatuses({});
                setCurrentIndex(0);
                setFlipped(false);
              }}
            >
              <Text style={styles.restartBtnText}>Restart Deck</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.restartBtnSecondary}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.restartBtnSecondaryText}>Back to Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardWrap}>
            {/* Flashcard */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setFlipped((f) => !f)}
              activeOpacity={0.9}
            >
              {flipped ? (
                <LinearGradient
                  colors={["#f0f4ff", "#fff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.cardInner}
                >
                  <Text style={[styles.cardEyebrow, { color: colors.success }]}>
                    ANSWER
                  </Text>
                  <Text style={styles.cardText}>{card.back}</Text>
                  <Text style={styles.tapHint}>Tap to flip back</Text>
                </LinearGradient>
              ) : (
                <View style={styles.cardInner}>
                  <Text style={styles.cardEyebrow}>QUESTION</Text>
                  <Text style={styles.cardText}>{card.front}</Text>
                  <Text style={styles.tapHint}>Tap to reveal answer</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Nav row */}
            <View style={styles.navRow}>
              <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
                <Text style={styles.navBtnText}>← Previous</Text>
              </TouchableOpacity>

              {/* Dot indicators */}
              <View style={styles.dotRow}>
                {cards.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          i === currentIndex
                            ? colors.primary
                            : i < currentIndex
                            ? "#bfdbfe"
                            : colors.border,
                        transform: [{ scale: i === currentIndex ? 1.3 : 1 }],
                      },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.navBtn} onPress={goNext}>
                <Text style={styles.navBtnText}>Next →</Text>
              </TouchableOpacity>
            </View>

            {/* Mark buttons */}
            {flipped && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.reviewBtn}
                  onPress={() => markCard("review")}
                >
                  <Text style={styles.reviewBtnText}>↩ Still Learning</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.knownBtn}
                  onPress={() => markCard("known")}
                >
                  <Text style={styles.knownBtnText}>✓ Got It</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.bg,
  },
  centerBackBtn: {
    marginBottom: 20,
  },
  centerBackText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  loadingText: {
    marginTop: 12,
    color: colors.fg2,
    fontSize: 15,
  },
  errorText: {
    color: colors.errorDark,
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
  },
  emptyText: {
    color: colors.fg2,
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingHorizontal: isWeb ? 32 : 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backBtnText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  topMeta: {
    alignItems: "center",
    flex: 1,
    gap: 2,
  },
  deckTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.fg1,
    maxWidth: isWeb ? 300 : 180,
  },
  counter: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primary,
  },
  counterTotal: {
    color: colors.fg3,
    fontWeight: "400",
  },
  topStats: {
    flexDirection: "row",
    gap: 12,
  },
  knownStat: {
    color: colors.success,
    fontWeight: "700",
    fontSize: 13,
  },
  reviewStat: {
    color: colors.warning,
    fontWeight: "700",
    fontSize: 13,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderTopRightRadius: radius.full,
    borderBottomRightRadius: radius.full,
  },
  cardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: isWeb ? 40 : 20,
  },
  cardWrap: {
    width: "100%",
    maxWidth: isWeb ? 600 : 390,
    gap: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    minHeight: isWeb ? 320 : 260,
    borderRadius: 24,
    overflow: "hidden",
    ...shadows.high,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardInner: {
    flex: 1,
    minHeight: isWeb ? 320 : 260,
    backgroundColor: "#fff",
    padding: isWeb ? 44 : 28,
    alignItems: "center",
    justifyContent: "center",
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },
  cardText: {
    fontSize: isWeb ? 24 : 20,
    fontWeight: "700",
    color: colors.fg1,
    textAlign: "center",
    lineHeight: isWeb ? 36 : 30,
    flex: 1,
    paddingVertical: 10,
  },
  tapHint: {
    fontSize: 12,
    color: colors.fg3,
    marginTop: 16,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  navBtn: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.low,
  },
  navBtnText: {
    fontWeight: "700",
    fontSize: 14,
    color: "#374151",
  },
  dotRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 14,
    width: "100%",
  },
  reviewBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: radius.lg,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: colors.warning,
  },
  reviewBtnText: {
    color: colors.warningDark,
    fontWeight: "800",
    fontSize: 15,
  },
  knownBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: radius.lg,
    backgroundColor: colors.successDark,
    ...shadows.mid,
  },
  knownBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  doneCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: isWeb ? 48 : 36,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    ...shadows.high,
  },
  doneEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  doneTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.fg1,
    marginBottom: 8,
  },
  doneSub: {
    fontSize: 15,
    color: colors.fg2,
    marginBottom: 28,
    textAlign: "center",
  },
  restartBtn: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    ...shadows.mid,
  },
  restartBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  restartBtnSecondary: {
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  restartBtnSecondaryText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 15,
  },
});
