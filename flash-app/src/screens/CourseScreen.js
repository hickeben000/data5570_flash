import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

import { deleteDocument, fetchDocuments } from "../store/documentsSlice";
import formatError from "../utils/formatError";
import { colors, radius, shadows } from "../theme";

const isWeb = Platform.OS === "web";

function DocRow({ item, isSelected, isSelecting, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.docRow, isSelected && styles.docRowSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isSelecting && (
        <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>
      )}
      <View style={styles.docIcon}>
        <Text style={styles.docIconText}>📄</Text>
      </View>
      <View style={styles.docInfo}>
        <Text style={styles.docTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.docMeta}>
          {item.source_type} · {new Date(item.uploaded_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

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
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
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

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `Delete ${selectedIds.length} document(s)?\n\nThis cannot be undone.`
      )
    ) {
      for (const id of selectedIds) {
        await dispatch(deleteDocument(id));
      }
      cancelSelectMode();
    }
  };

  const handleStudySelected = () => {
    navigation.navigate("DocumentAction", {
      courseId,
      documentIds: selectedIds,
    });
    cancelSelectMode();
  };

  const subtitle = isSelecting
    ? selectedIds.length === 0
      ? "Tap documents to select them."
      : `${selectedIds.length} selected`
    : "Tap a document to study it, or use Select to combine multiple.";

  const content = (
    <>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {error ? (
        <Text style={styles.error}>{formatError(error)}</Text>
      ) : null}

      {loading && documents.length === 0 ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            documents.length === 0 && styles.emptyList,
            styles.list,
          ]}
          renderItem={({ item }) => (
            <DocRow
              item={item}
              isSelected={selectedIds.includes(item.id)}
              isSelecting={isSelecting}
              onPress={() => handleCardPress(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No documents yet. Add one to start generating study content.
            </Text>
          }
        />
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1a56db", "#1560F0", "#2B7FFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {courseName}
          </Text>
          <View style={styles.headerActions}>
            {isSelecting ? (
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={cancelSelectMode}
              >
                <Text style={styles.headerBtnText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.headerBtn, styles.headerBtnOutline]}
                  onPress={() =>
                    navigation.navigate("QuizHistory", { courseId, courseName })
                  }
                >
                  <Text style={styles.headerBtnTextOutline}>Quiz History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerBtn}
                  onPress={enterSelectMode}
                >
                  <Text style={styles.headerBtnText}>Select</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Body */}
      {isWeb ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {content}
        </ScrollView>
      ) : (
        <View style={styles.body}>{content}</View>
      )}

      {/* Selection action bars */}
      {isSelecting && selectedIds.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.deleteBar}
            accessibilityLabel="Delete Selected"
            onPress={handleDeleteSelected}
          >
            <Text style={styles.deleteBarText}>
              Delete Selected ({selectedIds.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.studyBar}
            onPress={handleStudySelected}
          >
            <Text style={styles.studyBarText}>
              Study Selected ({selectedIds.length})
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Upload", { courseId, courseName })}
      >
        <Text style={styles.fabText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: isWeb ? 40 : 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: isWeb ? 28 : 22,
    fontWeight: "900",
    color: "#fff",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  headerBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  headerBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  headerBtnTextOutline: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  body: {
    flex: 1,
    paddingHorizontal: isWeb ? 40 : 20,
    paddingTop: 20,
  },
  bodyContent: {
    paddingBottom: 100,
  },
  subtitle: {
    marginBottom: 16,
    color: colors.fg2,
    fontSize: 14,
  },
  error: {
    color: colors.errorDark,
    marginBottom: 8,
    fontSize: 14,
  },
  list: {
    paddingBottom: 120,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    textAlign: "center",
    color: colors.fg2,
    fontSize: 15,
    paddingTop: 40,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    gap: 12,
    ...shadows.low,
  },
  docRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#c0c8e0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkCircleSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  docIconText: {
    fontSize: 18,
  },
  docInfo: {
    flex: 1,
    minWidth: 0,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.fg1,
    marginBottom: 3,
  },
  docMeta: {
    fontSize: 12,
    color: colors.fg3,
  },
  deleteBar: {
    position: "absolute",
    bottom: 164,
    left: 20,
    right: 20,
    backgroundColor: colors.errorDark,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    ...shadows.high,
  },
  deleteBarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  studyBar: {
    position: "absolute",
    bottom: 94,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    ...shadows.high,
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
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: 22,
    paddingVertical: 16,
    ...shadows.high,
  },
  fabText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
