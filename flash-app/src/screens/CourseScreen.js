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

import Card from "../components/Card";
import { fetchDocuments } from "../store/documentsSlice";
import formatError from "../utils/formatError";

export default function CourseScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments(courseId));
  }, [dispatch, courseId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{courseName}</Text>
      <Text style={styles.subtitle}>
        Tap a document to generate study materials or add a new one.
      </Text>

      {error ? <Text style={styles.error}>{formatError(error)}</Text> : null}

      {loading && documents.length === 0 ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#4361ee" />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={documents.length === 0 && styles.emptyList}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              content={`Source: ${item.source_type} • ${new Date(
                item.uploaded_at
              ).toLocaleDateString()}`}
              onPress={() =>
                navigation.navigate("DocumentAction", {
                  courseId,
                  documentId: item.id,
                  documentTitle: item.title,
                })
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No documents yet. Add one to start generating study content.
            </Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("Upload", {
            courseId,
            courseName,
          })
        }
      >
        <Text style={styles.fabText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    color: "#666",
    fontSize: 15,
  },
  error: {
    color: "#c0392b",
    marginBottom: 8,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
    color: "#7b8191",
    fontSize: 15,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "#4361ee",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontWeight: "700",
  },
});
