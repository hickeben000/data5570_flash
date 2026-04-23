import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

import {
  clearCoursesError,
  createCourse,
  deleteCourse,
  fetchCourses,
} from "../store/coursesSlice";
import formatError from "../utils/formatError";
import { colors, radius, shadows } from "../theme";

const isWeb = Platform.OS === "web";

const COURSE_GRADIENTS = [
  ["#2B7FFF", "#1560F0"],
  ["#7c3aed", "#4f46e5"],
  ["#0891b2", "#0e7490"],
  ["#db2777", "#be185d"],
  ["#d97706", "#b45309"],
];

const COURSE_EMOJIS = ["📚", "🌍", "🧬", "🧠", "∑", "🔬", "🎓", "📐"];

function getGradient(index) {
  return COURSE_GRADIENTS[index % COURSE_GRADIENTS.length];
}

function getEmoji(index) {
  return COURSE_EMOJIS[index % COURSE_EMOJIS.length];
}

function CourseCard({ item, index, onPress, onDelete }) {
  const gradient = getGradient(index);
  const emoji = getEmoji(index);

  return (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.courseCardTop}
      >
        <Text style={styles.courseEmoji}>{emoji}</Text>
        <Text style={styles.courseDateChip}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </LinearGradient>
      <View style={styles.courseCardBody}>
        <Text style={styles.courseName} numberOfLines={2}>
          {item.name}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          accessibilityLabel={`Delete ${item.name}`}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const user = useSelector((state) => state.auth.user);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleDeleteCourse = (course) => {
    if (
      window.confirm(
        `Delete "${course.name}"?\n\nThis will also remove all its documents and quizzes.`
      )
    ) {
      dispatch(deleteCourse(course.id));
    }
  };

  const handleCreateCourse = () => {
    const trimmedName = courseName.trim();
    if (!trimmedName) return;
    dispatch(createCourse({ name: trimmedName })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        setCourseName("");
      }
    });
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = user?.username || "there";

  return (
    <View style={styles.container}>
      {/* Hero banner */}
      <LinearGradient
        colors={["#1a56db", "#1560F0", "#2B7FFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroGreeting}>
            {greeting}, {displayName} 👋
          </Text>
          <Text style={styles.heroSub}>What will you work on today?</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{courses.length}</Text>
            <Text style={styles.statLabel}>COURSES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>
              {loading && courses.length === 0 ? "—" : courses.length > 0 ? "∞" : "0"}
            </Text>
            <Text style={styles.statLabel}>STUDY</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Courses section */}
      <View style={styles.section}>
        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Courses</Text>
        </View>

        {/* Create course form — always visible */}
        <View style={styles.addCard}>
          <TextInput
            style={styles.addInput}
            placeholder="Example: Biology 101"
            placeholderTextColor={colors.fg3}
            value={courseName}
            onChangeText={(text) => {
              setCourseName(text);
              if (error) dispatch(clearCoursesError());
            }}
            onSubmitEditing={handleCreateCourse}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addConfirm} onPress={handleCreateCourse}>
            <Text style={styles.addConfirmText}>Add Course</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={styles.error}>{formatError(error)}</Text>
        ) : null}

        {/* Course list */}
        {loading && courses.length === 0 ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={courses}
            keyExtractor={(item) => String(item.id)}
            numColumns={isWeb ? 3 : 1}
            key={isWeb ? "web" : "mobile"}
            columnWrapperStyle={isWeb ? styles.gridRow : undefined}
            contentContainerStyle={[
              courses.length === 0 && styles.emptyList,
              styles.list,
            ]}
            renderItem={({ item, index }) => (
              <CourseCard
                item={item}
                index={index}
                onPress={() =>
                  navigation.navigate("Course", {
                    courseId: item.id,
                    courseName: item.name,
                  })
                }
                onDelete={() => handleDeleteCourse(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No courses yet. Create one above to get started.
              </Text>
            }
          />
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
  hero: {
    padding: isWeb ? 40 : 24,
    paddingTop: isWeb ? 40 : 52,
    flexDirection: isWeb ? "row" : "column",
    alignItems: isWeb ? "center" : "stretch",
    justifyContent: "space-between",
    gap: 20,
  },
  heroContent: {
    flex: isWeb ? 1 : undefined,
  },
  heroGreeting: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.lg,
    padding: 14,
    paddingHorizontal: 20,
    alignSelf: isWeb ? "auto" : "stretch",
    justifyContent: "center",
  },
  stat: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statNum: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.6,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  section: {
    flex: 1,
    padding: isWeb ? 40 : 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.fg1,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  addCard: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  addInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: radius.md,
    padding: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.fg1,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  addConfirm: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
  },
  addConfirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  error: {
    color: colors.errorDark,
    marginBottom: 12,
    fontSize: 14,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  list: {
    paddingBottom: 40,
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
  gridRow: {
    gap: 20,
    marginBottom: 20,
  },
  courseCard: {
    flex: isWeb ? 1 : undefined,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: isWeb ? 0 : 16,
    maxWidth: isWeb ? 340 : undefined,
    ...shadows.mid,
  },
  courseCardTop: {
    height: 100,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseEmoji: {
    fontSize: 38,
  },
  courseDateChip: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  courseCardBody: {
    padding: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  courseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: colors.fg1,
    marginRight: 8,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: colors.errorDark,
    fontWeight: "700",
    fontSize: 12,
  },
});
