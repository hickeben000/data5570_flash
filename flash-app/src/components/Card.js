import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({ title, content, onPress, style }) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {content ? <Text style={styles.content}>{content}</Text> : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1a1a2e",
  },
  content: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});
