import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius, shadows } from "../theme";

export default function Card({ title, content, onPress, style }) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={[styles.card, style]} onPress={onPress} activeOpacity={0.85}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {content ? <Text style={styles.content}>{content}</Text> : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    ...shadows.mid,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    color: colors.fg1,
  },
  content: {
    fontSize: 15,
    color: colors.fg2,
    lineHeight: 22,
  },
});
