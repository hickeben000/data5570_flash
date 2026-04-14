import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // 🔥 Load saved API key
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        let savedKey;

        if (Platform.OS === "web") {
          savedKey = localStorage.getItem("gemini_api_key");
        } else {
          savedKey = await SecureStore.getItemAsync("gemini_api_key");
        }

        console.log("Loaded key:", savedKey);

        if (savedKey) {
          setApiKey(savedKey);
          setStatusMessage("Saved API key loaded.");
        } else {
          setStatusMessage("No saved API key found.");
        }
      } catch (error) {
        console.error("Error loading API key:", error);
        setStatusMessage("Error loading API key.");
      }
    };

    loadApiKey();
  }, []);

  // 🔥 Save API key
  const handleSave = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("gemini_api_key", apiKey);
      } else {
        await SecureStore.setItemAsync("gemini_api_key", apiKey);
      }

      console.log("Saved key:", apiKey);
      setStatusMessage("API key saved successfully.");
    } catch (error) {
      console.error("Error saving API key:", error);
      setStatusMessage("Error saving API key.");
    }
  };

  const handleLogout = () => {
    setStatusMessage("Logout functionality will be added soon.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Manage your app preferences and account options.
      </Text>

      {statusMessage ? (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      ) : null}

      {/* 🔥 AI SETTINGS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Settings</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gemini API Key</Text>
          <Text style={styles.cardText}>
            Enter your Gemini API key to enable AI features.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            secureTextEntry
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save API Key</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ACCOUNT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Account settings will go here.
          </Text>
        </View>
      </View>

      {/* APPEARANCE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Theme settings coming soon.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f7fb",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24,
  },
  statusBox: {
    backgroundColor: "#e0ecff",
    borderColor: "#4361ee",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  statusText: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4361ee",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#4361ee",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});