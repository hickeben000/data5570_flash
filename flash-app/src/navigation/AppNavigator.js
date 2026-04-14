import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import UploadScreen from "../screens/UploadScreen";
import DocumentActionScreen from "../screens/DocumentActionScreen";
import FlashcardScreen from "../screens/FlashcardScreen";
import QuizConfigScreen from "../screens/QuizConfigScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

/* 🔥 Custom Sidebar */
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="🏠 Home"
        onPress={() => props.navigation.navigate("Home")}
      />
      <DrawerItem
        label="⬆️ Upload Documents"
        onPress={() => props.navigation.navigate("Upload Documents")}
      />
      <DrawerItem
        label="⚙️ Settings"
        onPress={() => props.navigation.navigate("Settings")}
      />
      <DrawerItem
        label="❌ Close Menu"
        onPress={() => props.navigation.closeDrawer()}
      />
    </DrawerContentScrollView>
  );
}

/* 🔥 Drawer (Sidebar with hamburger button) */
function MainApp() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#4361ee" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Text style={{ color: "#fff", fontSize: 22 }}>☰</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Upload Documents" component={UploadScreen} />
      <Drawer.Screen name="Settings" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

/* 🔥 Main Navigation */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DocumentAction"
          component={DocumentActionScreen}
          options={{ title: "Choose Action" }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}