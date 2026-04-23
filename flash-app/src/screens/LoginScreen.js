import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const flashLogo = require('../../assets/flash-logo.png');
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUser } from "../store/authSlice";
import formatError from "../utils/formatError";
import { colors, radius, shadows, typography } from "../theme";

const isWeb = Platform.OS === "web";

function FeatureRow({ label }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureDot} />
      <Text style={styles.featureText}>{label}</Text>
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ username, password }));
  };

  const formCard = (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Welcome back</Text>
      <Text style={styles.formSub}>Sign in to continue studying</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{formatError(error)}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={colors.fg3}
        autoCapitalize="none"
        value={username}
        onChangeText={(t) => {
          setUsername(t);
          dispatch(clearError());
        }}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.fg3}
        secureTextEntry
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          dispatch(clearError());
        }}
      />

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Log In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Create one</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        {/* Left panel — white, features */}
        <View style={styles.leftPanel}>
          <Image source={flashLogo} style={styles.logoImg} resizeMode="contain" />
          <Text style={styles.heroText}>Learn in a flash.</Text>
          <Text style={styles.heroSub}>
            Upload your notes, textbooks, or assignments — and get personalized
            flashcards and quizzes in seconds.
          </Text>
          <View style={styles.features}>
            {[
              "AI-generated flashcards",
              "Auto-graded quizzes",
              "Instant feedback",
              "Any subject, any level",
            ].map((f) => (
              <FeatureRow key={f} label={f} />
            ))}
          </View>
        </View>

        {/* Right panel — gradient bg, white form card */}
        <LinearGradient
          colors={["#1a56db", "#1560F0", "#2B7FFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.rightPanel}
        >
          {formCard}
        </LinearGradient>
      </View>
    );
  }

  // Mobile layout
  return (
    <LinearGradient
      colors={["#1a56db", "#1560F0", "#2B7FFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.mobileGradient}
    >
      <ScrollView
        contentContainerStyle={styles.mobileScroll}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={flashLogo} style={styles.mobileLogoImg} resizeMode="contain" />
        <Text style={styles.mobileTagline}>Learn in a flash.</Text>
        {formCard}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Web layout
  webContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImg: {
    height: 140,
    width: 280,
    marginBottom: 32,
  },
  heroText: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.brandStart,
    lineHeight: 40,
    marginBottom: 14,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 15,
    color: colors.primary,
    lineHeight: 24,
    marginBottom: 36,
    textAlign: "center",
    maxWidth: 320,
  },
  features: {
    width: "100%",
    maxWidth: 300,
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
  rightPanel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },

  // Mobile layout
  mobileGradient: {
    flex: 1,
  },
  mobileScroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  mobileLogoImg: {
    height: 80,
    width: 200,
    marginBottom: 12,
  },
  mobileTagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 32,
  },

  // Shared form card
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 36,
    width: "100%",
    maxWidth: 400,
    ...shadows.high,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.fg1,
    marginBottom: 6,
  },
  formSub: {
    fontSize: 14,
    color: colors.fg2,
    marginBottom: 28,
  },
  errorBox: {
    backgroundColor: colors.errorBg || "#fee2e2",
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: 13,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.md,
    padding: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.fg1,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 18,
    width: "100%",
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
    ...shadows.mid,
  },
  btnDisabled: {
    opacity: 0.75,
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    color: colors.fg2,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700",
  },
});
