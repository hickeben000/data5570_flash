import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function HomeScreen() {
  const topics = []; // later this comes from backend

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Topics</Text>

      {topics.length === 0 ? (
        <Text style={styles.empty}>
          No topics yet. Upload a document to get started.
        </Text>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
  },
});