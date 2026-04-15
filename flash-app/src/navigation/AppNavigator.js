import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CourseScreen from "../screens/CourseScreen";
import UploadScreen from "../screens/UploadScreen";
import SettingsScreen from "../screens/SettingsScreen";
import DocumentActionScreen from "../screens/DocumentActionScreen";
import FlashcardScreen from "../screens/FlashcardScreen";
import QuizConfigScreen from "../screens/QuizConfigScreen";
import QuizScreen from "../screens/QuizScreen";
import QuizResultsScreen from "../screens/QuizResultsScreen";
import { logoutUser, restoreSession } from "../store/authSlice";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function AppLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4361ee" />
      <Text style={styles.loadingText}>Loading your workspace...</Text>
    </View>
  );
}

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Flash</Text>
        <Text style={styles.drawerSubtitle}>
          {user?.username ? `Signed in as ${user.username}` : "Study smarter"}
        </Text>
      </View>

      <DrawerItem label="Home" onPress={() => props.navigation.navigate("Home")} />
      <DrawerItem
        label="Settings"
        onPress={() => props.navigation.navigate("Settings")}
      />
      <DrawerItem label="Log Out" onPress={() => dispatch(logoutUser())} />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#4361ee" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={styles.menuButton}
          >
            <Text style={styles.menuButtonText}>Menu</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

function AuthenticatedNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainDrawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
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
        name="DocumentAction"
        component={DocumentActionScreen}
        options={{ title: "Study Options" }}
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
        options={{ title: "Quiz" }}
      />
      <Stack.Screen
        name="QuizResults"
        component={QuizResultsScreen}
        options={{ title: "Results" }}
      />
    </Stack.Navigator>
  );
}

function UnauthenticatedNavigator() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { token, bootstrapping } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <NavigationContainer>
      {bootstrapping ? (
        <AppLoadingScreen />
      ) : token ? (
        <AuthenticatedNavigator />
      ) : (
        <UnauthenticatedNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#555",
    fontSize: 15,
  },
  drawerHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
  },
  drawerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  drawerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  menuButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  menuButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
