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
  fetchDeck,
  generateFlashcards,
  updateCardStatus,
} from "../store/flashcardsSlice";

export default function FlashcardScreen({ route }) {
  const { deckId, documentId } = route.params || {};
  const dispatch = useDispatch();
  const { deck, loading } = useSelector((state) => state.flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (deckId) {
      dispatch(fetchDeck(deckId));
    } else if (documentId) {
      dispatch(generateFlashcards({ documentId }));
    }
  }, [dispatch, deckId, documentId]);

  if (loading || !deck) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4361ee" />
        <Text style={styles.loadingText}>Generating flashcards...</Text>
      </View>
    );
  }

  const cards = deck.cards || [];
  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No flashcards available.</Text>
      </View>
    );
  }

  const card = cards[currentIndex];

  const markCard = (status) => {
    dispatch(updateCardStatus({ cardId: card.id, status }));
    goNext();
  };

  const goNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const goPrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{deck.title}</Text>
      <Text style={styles.counter}>
        {currentIndex + 1} / {cards.length}
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => setFlipped(!flipped)}
        activeOpacity={0.9}
      >
        <Text style={styles.cardLabel}>{flipped ? "Answer" : "Question"}</Text>
        <Text style={styles.cardText}>
          {flipped ? card.back : card.front}
        </Text>
        <Text style={styles.tapHint}>Tap to flip</Text>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
          <Text style={styles.navBtnText}>Prev</Text>
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
  container: { flex: 1, backgroundColor: "#f5f7fb", paddingTop: 60, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666" },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
    textAlign: "center",
  },
  counter: {
    textAlign: "center",
    color: "#888",
    marginVertical: 8,
    fontSize: 14,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    marginVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4361ee",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  cardText: { fontSize: 20, textAlign: "center", color: "#1a1a2e", lineHeight: 28 },
  tapHint: {
    position: "absolute",
    bottom: 16,
    color: "#bbb",
    fontSize: 12,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navBtn: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  navBtnText: { fontWeight: "600", color: "#333" },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statusBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  knownBtn: { backgroundColor: "#2ecc71" },
  reviewBtn: { backgroundColor: "#e67e22" },
  statusBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
