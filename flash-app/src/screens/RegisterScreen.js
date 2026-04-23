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
import { registerUser } from "../store/authSlice";
import formatError from "../utils/formatError";
import { colors, radius, shadows } from "../theme";

const isWeb = Platform.OS === "web";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = () => {
    dispatch(registerUser({ username, email, password })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Login");
      }
    });
  };

  const formCard = (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Create account</Text>
      <Text style={styles.formSub}>Join Flash and learn in a flash</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{formatError(error)}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="choose_a_username"
        placeholderTextColor={colors.fg3}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor={colors.fg3}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor={colors.fg3}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isWeb) {
    return (
      <View style={styles.webContainer}>
        <View style={styles.leftPanel}>
          <Image source={flashLogo} style={styles.logoImg} resizeMode="contain" />
          <Text style={styles.heroText}>Start studying smarter today.</Text>
          <Text style={styles.heroSub}>
            Create your free account and transform how you learn with
            AI-powered flashcards and quizzes.
          </Text>
        </View>
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
        <Text style={styles.mobileTagline}>Start studying smarter.</Text>
        {formCard}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    height: 280,
    width: 560,
    marginBottom: 32,
  },
  heroText: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.brandStart,
    lineHeight: 36,
    marginBottom: 14,
    textAlign: "center",
  },
  heroSub: {
    fontSize: 15,
    color: colors.primary,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 320,
  },
  rightPanel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
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
    backgroundColor: "#fee2e2",
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
