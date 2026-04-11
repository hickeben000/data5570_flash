import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import { fetchDocuments } from "../store/documentsSlice";

export default function CourseScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments(courseId));
  }, [dispatch, courseId]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{courseName}</Text>

      <FlatList
        data={documents}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            content={`Source: ${item.source_type} • ${new Date(
              item.uploaded_at
            ).toLocaleDateString()}`}
            onPress={() =>
              navigation.navigate("Upload", {
                documentId: item.id,
                documentTitle: item.title,
                courseId,
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? "Loading..." : "No documents yet. Upload one!"}
          </Text>
        }
        contentContainerStyle={documents.length === 0 && styles.emptyList}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Upload", { courseId })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb", paddingTop: 60 },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a2e",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  empty: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 40,
  },
  emptyList: { flexGrow: 1, justifyContent: "center" },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4361ee",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 30 },
});
