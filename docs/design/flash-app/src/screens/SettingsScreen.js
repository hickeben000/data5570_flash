import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../store/authSlice";
import {
  clearOpenAIApiKey,
  getOpenAIApiKey,
  setOpenAIApiKey,
} from "../utils/storage";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [apiKey, setApiKeyInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const loadApiKey = async () => {
      const savedKey = await getOpenAIApiKey();
      if (savedKey) {
        setApiKeyInput(savedKey);
        setStatusMessage("Your OpenAI key is stored only on this device.");
      } else {
        setStatusMessage("No OpenAI key saved yet.");
      }
    };

    loadApiKey();
  }, []);

  const handleSave = async () => {
    await setOpenAIApiKey(apiKey);
    setStatusMessage("OpenAI key saved on this device.");
  };

  const handleClear = async () => {
    await clearOpenAIApiKey();
    setApiKeyInput("");
    setStatusMessage("OpenAI key removed from this device.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Manage your AI key and account session.
      </Text>

      {statusMessage ? (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OpenAI API Key</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Flash stores your key locally on this device and only attaches it to AI-backed requests.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your OpenAI API key (sk-...)"
            value={apiKey}
            onChangeText={setApiKeyInput}
            autoCapitalize="none"
            secureTextEntry
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Key</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear Key</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {user?.username ? `Signed in as ${user.username}.` : "You are signed in."}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logoutUser())}>
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
    fontWeight: "800",
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
    borderRadius: 10,
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
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#4361ee",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  clearButton: {
    backgroundColor: "#eef1ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#4361ee",
    fontWeight: "700",
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#111827",
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
