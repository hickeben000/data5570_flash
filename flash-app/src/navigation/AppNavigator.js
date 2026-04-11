import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CourseScreen from "../screens/CourseScreen";
import UploadScreen from "../screens/UploadScreen";
import FlashcardScreen from "../screens/FlashcardScreen";
import QuizConfigScreen from "../screens/QuizConfigScreen";
import QuizScreen from "../screens/QuizScreen";
import QuizResultsScreen from "../screens/QuizResultsScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#4361ee" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Flash", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Course"
          component={CourseScreen}
          options={({ route }) => ({ title: route.params?.courseName || "Course" })}
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: "Add Document" }}
        />
        <Stack.Screen
          name="Flashcards"
          component={FlashcardScreen}
          options={{ title: "Flashcards" }}
        />
        <Stack.Screen
          name="QuizConfig"
          component={QuizConfigScreen}
          options={{ title: "Quiz Setup" }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: "Take Quiz" }}
        />
        <Stack.Screen
          name="QuizResults"
          component={QuizResultsScreen}
          options={{ title: "Results" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
