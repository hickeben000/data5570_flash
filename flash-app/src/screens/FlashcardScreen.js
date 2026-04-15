import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  clearFlashcardsError,
  fetchDeck,
  generateFlashcards,
  updateCardStatus,
} from "../store/flashcardsSlice";
import formatError from "../utils/formatError";

export default function FlashcardScreen({ route }) {
  const { deckId, documentId, numCards = 10, extraPrompt = "" } = route.params || {};
  const dispatch = useDispatch();
  const { deck, loading, error } = useSelector((state) => state.flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    dispatch(clearFlashcardsError());
    if (deckId) {
      dispatch(fetchDeck(deckId));
    } else if (documentId) {
      dispatch(
        generateFlashcards({
          documentId,
          numCards,
          extraPrompt,
        })
      );
    }
    setCurrentIndex(0);
    setFlipped(false);
  }, [dispatch, deckId, documentId, numCards, extraPrompt]);

  if (loading && !deck) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={styles.loadingText}>Generating flashcards...</Text>
      </View>
    );
  }

  if (error && !deck) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{formatError(error)}</Text>
      </View>
    );
  }

  const cards = deck?.cards || [];
  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No flashcards available yet.</Text>
      </View>
    );
  }

  const card = cards[currentIndex];

  const goNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const goPrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markCard = (status) => {
    dispatch(updateCardStatus({ cardId: card.id, status }));
    goNext();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{deck.title}</Text>
      <Text style={styles.counter}>
        Card {currentIndex + 1} of {cards.length}
      </Text>

      {error ? <Text style={styles.inlineError}>{formatError(error)}</Text> : null}

      <TouchableOpacity
        style={styles.card}
        onPress={() => setFlipped((current) => !current)}
        activeOpacity={0.9}
      >
        <Text style={styles.cardLabel}>{flipped ? "Answer" : "Question"}</Text>
        <Text style={styles.cardText}>{flipped ? card.back : card.front}</Text>
        <Text style={styles.tapHint}>Tap to flip</Text>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
          <Text style={styles.navBtnText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={goNext}>
          <Text style={styles.navBtnText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <TouchableOpacity
          style={[styles.statusBtn, styles.knownBtn]}
          onPress={() => markCard("known")}
        >
          <Text style={styles.statusBtnText}>Known</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusBtn, styles.reviewBtn]}
          onPress={() => markCard("review")}
        >
          <Text style={styles.statusBtnText}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f7fb",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  error: {
    color: "#c0392b",
    textAlign: "center",
    lineHeight: 22,
  },
  inlineError: {
    color: "#c0392b",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
  },
  counter: {
    marginTop: 6,
    marginBottom: 12,
    textAlign: "center",
    color: "#6b7280",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4361ee",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 22,
    lineHeight: 30,
    textAlign: "center",
    color: "#1a1a2e",
  },
  tapHint: {
    position: "absolute",
    bottom: 18,
    color: "#9ca3af",
    fontSize: 12,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  navBtn: {
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  navBtnText: {
    fontWeight: "700",
    color: "#374151",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statusBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  knownBtn: {
    marginRight: 8,
    backgroundColor: "#27ae60",
  },
  reviewBtn: {
    marginLeft: 8,
    backgroundColor: "#d97706",
  },
  statusBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
