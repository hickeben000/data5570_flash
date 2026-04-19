import React, { useEffect, useState } from "react";
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

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(fetchDocuments(courseId));
  }, [dispatch, courseId]);

  const handleCardPress = (item) => {
    if (!isSelecting) {
      navigation.navigate("DocumentAction", {
        courseId,
        documentId: item.id,
        documentTitle: item.title,
      });
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const enterSelectMode = () => {
    setIsSelecting(true);
    setSelectedIds([]);
  };

  const cancelSelectMode = () => {
    setIsSelecting(false);
    setSelectedIds([]);
  };

  const handleStudySelected = () => {
    navigation.navigate("DocumentAction", {
      courseId,
      documentIds: selectedIds,
    });
    cancelSelectMode();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{courseName}</Text>
        {isSelecting ? (
          <TouchableOpacity onPress={cancelSelectMode} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={enterSelectMode} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Select</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitle}>
        {isSelecting
          ? selectedIds.length === 0
            ? "Tap documents to select them."
            : `${selectedIds.length} selected`
          : "Tap a document to study it, or use Select to combine multiple."}
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
          contentContainerStyle={[
            documents.length === 0 && styles.emptyList,
            styles.list,
          ]}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <View style={[styles.cardWrapper, isSelected && styles.cardWrapperSelected]}>
                {isSelecting && (
                  <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                )}
                <View style={styles.cardFlex}>
                  <Card
                    title={item.title}
                    content={`Source: ${item.source_type} • ${new Date(
                      item.uploaded_at
                    ).toLocaleDateString()}`}
                    onPress={() => handleCardPress(item)}
                  />
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No documents yet. Add one to start generating study content.
            </Text>
          }
        />
      )}

      {isSelecting && selectedIds.length > 0 && (
        <TouchableOpacity style={styles.studyBar} onPress={handleStudySelected}>
          <Text style={styles.studyBarText}>
            Study Selected ({selectedIds.length})
          </Text>
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
    flexShrink: 1,
  },
  headerButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#eef1ff",
  },
  headerButtonText: {
    color: "#4361ee",
    fontWeight: "700",
    fontSize: 14,
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
  list: {
    paddingBottom: 100,
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
  cardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 2,
  },
  cardWrapperSelected: {
    borderColor: "#4361ee",
    backgroundColor: "#eef1ff",
    borderRadius: 14,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#c0c8e0",
    backgroundColor: "#fff",
    marginLeft: 4,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: {
    backgroundColor: "#4361ee",
    borderColor: "#4361ee",
  },
  checkMark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  cardFlex: {
    flex: 1,
  },
  studyBar: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#4361ee",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  studyBarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
