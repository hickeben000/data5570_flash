import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";
import { createCourse, fetchCourses } from "../store/coursesSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);
  const [newCourseName, setNewCourseName] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleCreate = () => {
    if (!newCourseName.trim()) return;
    dispatch(createCourse({ name: newCourseName.trim() }));
    setNewCourseName("");
    setShowInput(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card
            title={item.name}
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
            {loading ? "Loading..." : "No courses yet. Create one!"}
          </Text>
        }
        contentContainerStyle={courses.length === 0 && styles.emptyList}
      />

      {showInput ? (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Course name"
            value={newCourseName}
            onChangeText={setNewCourseName}
            autoFocus
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowInput(!showInput)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb", paddingTop: 60 },
  heading: {
    fontSize: 28,
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
  inputRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addBtnText: { color: "#fff", fontWeight: "700" },
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
