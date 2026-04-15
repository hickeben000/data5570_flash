import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Card from "../components/Card";
import formatError from "../utils/formatError";
import {
  clearCoursesError,
  createCourse,
  fetchCourses,
} from "../store/coursesSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleCreateCourse = () => {
    const trimmedName = courseName.trim();
    if (!trimmedName) {
      return;
    }

    dispatch(createCourse({ name: trimmedName })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        setCourseName("");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Courses</Text>
      <Text style={styles.subtitle}>
        Create a course, add study materials, and generate flashcards or quizzes.
      </Text>

      <View style={styles.createCard}>
        <Text style={styles.sectionTitle}>Create a course</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Biology 101"
          value={courseName}
          onChangeText={(text) => {
            setCourseName(text);
            if (error) {
              dispatch(clearCoursesError());
            }
          }}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
          <Text style={styles.buttonText}>Add Course</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{formatError(error)}</Text> : null}

      {loading && courses.length === 0 ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#4361ee" />
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={courses.length === 0 && styles.emptyList}
          renderItem={({ item }) => (
            <Card
              title={item.name}
              content={`Created ${new Date(item.created_at).toLocaleDateString()}`}
              onPress={() =>
                navigation.navigate("Course", {
                  courseId: item.id,
                  courseName: item.name,
                })
              }
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
  },
  createCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f8f9fd",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dfe4f1",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#4361ee",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  error: {
    color: "#c0392b",
    marginBottom: 12,
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
});
