import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const flashLogo = require('../../assets/flash-logo.png');
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
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
import QuizHistoryScreen from "../screens/QuizHistoryScreen";
import { logoutUser, restoreSession } from "../store/authSlice";
import { colors, radius } from "../theme";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const isWeb = Platform.OS === 'web';

// ── Loading screen ───────────────────────────────────────────────
function AppLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading your workspace...</Text>
    </View>
  );
}

// ── Main app stack ───────────────────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        cardStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Course"
        component={CourseScreen}
        options={({ route }) => ({ title: route.params?.courseName || 'Course' })}
      />
      <Stack.Screen name="Upload" component={UploadScreen} options={{ title: 'Add Document' }} />
      <Stack.Screen name="DocumentAction" component={DocumentActionScreen} options={{ title: 'Study Options' }} />
      <Stack.Screen name="Flashcards" component={FlashcardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuizConfig" component={QuizConfigScreen} options={{ title: 'Quiz Setup' }} />
      <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuizResults" component={QuizResultsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuizHistory" component={QuizHistoryScreen} options={{ title: 'Quiz History' }} />
    </Stack.Navigator>
  );
}

// ── Sidebar content (web + mobile drawer) ───────────────────────
function SidebarContent(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'ME';
  const activeRoute = props.state?.routes?.[props.state.index]?.name;

  const navItems = [
    { name: 'HomeStack', label: 'Courses', emoji: '📚' },
    { name: 'Settings', label: 'Settings', emoji: '⚙️' },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.sidebarContainer}
      scrollEnabled={false}
    >
      <View style={styles.sidebarLogoArea}>
        <Image source={flashLogo} style={styles.sidebarLogoImg} resizeMode="contain" />
      </View>

      <View style={styles.sidebarNav}>
        {navItems.map((item) => {
          const isActive = activeRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.sidebarNavItem, isActive && styles.sidebarNavItemActive]}
              onPress={() => props.navigation.navigate(item.name)}
            >
              <Text style={styles.sidebarNavEmoji}>{item.emoji}</Text>
              <Text style={[styles.sidebarNavLabel, isActive && styles.sidebarNavLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sidebarBottom}>
        <View style={styles.sidebarUserRow}>
          <View style={styles.sidebarAvatar}>
            <Text style={styles.sidebarAvatarText}>{initials}</Text>
          </View>
          <View style={styles.sidebarUserInfo}>
            <Text style={styles.sidebarUsername} numberOfLines={1}>
              {user?.username || 'You'}
            </Text>
            <Text style={styles.sidebarUserSub}>Flash student</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.sidebarLogoutBtn} onPress={() => dispatch(logoutUser())}>
          <Text style={styles.sidebarLogoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

// ── Web: permanent sidebar ───────────────────────────────────────
function WebAuthenticatedNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidebarContent {...props} />}
      screenOptions={{
        drawerType: 'permanent',
        drawerStyle: {
          width: 220,
          backgroundColor: '#fff',
          borderRightWidth: 1,
          borderRightColor: colors.border,
        },
        headerShown: false,
        sceneContainerStyle: { backgroundColor: colors.bg },
        overlayColor: 'transparent',
      }}
    >
      <Drawer.Screen name="HomeStack" component={HomeStack} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

// ── Mobile: slide drawer (swipe from left) ───────────────────────
function MobileAuthenticatedNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidebarContent {...props} />}
      screenOptions={{
        drawerType: 'slide',
        drawerStyle: {
          width: 260,
          backgroundColor: '#fff',
        },
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        sceneContainerStyle: { backgroundColor: colors.bg },
      }}
    >
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: 'Flash', headerShown: false }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Drawer.Navigator>
  );
}

// ── Unauthenticated ──────────────────────────────────────────────
function UnauthenticatedNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// ── Root ─────────────────────────────────────────────────────────
export default function AppNavigator() {
  const dispatch = useDispatch();
  const { token, bootstrapping } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const AuthNavigator = isWeb ? WebAuthenticatedNavigator : MobileAuthenticatedNavigator;

  return (
    <NavigationContainer>
      {bootstrapping ? (
        <AppLoadingScreen />
      ) : token ? (
        <AuthNavigator />
      ) : (
        <UnauthenticatedNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.fg2,
    fontSize: 15,
  },
  sidebarContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sidebarLogoArea: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sidebarLogoImg: {
    height: 36,
    width: 120,
  },
  sidebarNav: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    gap: 2,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  sidebarNavItemActive: {
    backgroundColor: colors.primaryLight,
  },
  sidebarNavEmoji: {
    fontSize: 16,
  },
  sidebarNavLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.fg2,
  },
  sidebarNavLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  sidebarBottom: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sidebarUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sidebarAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarAvatarText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  sidebarUserInfo: {
    flex: 1,
    minWidth: 0,
  },
  sidebarUsername: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.fg1,
  },
  sidebarUserSub: {
    fontSize: 11,
    color: colors.fg3,
    marginTop: 1,
  },
  sidebarLogoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sidebarLogoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.fg3,
  },
});
