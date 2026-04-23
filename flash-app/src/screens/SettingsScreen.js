import React, { useEffect, useState } from "react";
import {
  Platform,
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
import { colors, radius, shadows } from "../theme";

const isWeb = Platform.OS === "web";

function Toggle({ on, onToggle }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.toggle, on && styles.toggleOn]}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleThumb, on && styles.toggleThumbOn]} />
    </TouchableOpacity>
  );
}

function SectionCard({ children }) {
  return <View style={styles.prefCard}>{children}</View>;
}

function PrefRow({ label, desc, right }) {
  return (
    <View style={styles.prefRow}>
      <View style={styles.prefInfo}>
        <Text style={styles.prefLabel}>{label}</Text>
        {desc ? <Text style={styles.prefDesc}>{desc}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [apiKey, setApiKeyInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [savedOk, setSavedOk] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "ME";

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
    setSavedOk(true);
    setStatusMessage("OpenAI key saved on this device.");
    setTimeout(() => setSavedOk(false), 2000);
  };

  const handleClear = async () => {
    await clearOpenAIApiKey();
    setApiKeyInput("");
    setStatusMessage("OpenAI key removed from this device.");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Profile hero */}
      <View style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username || "You"}</Text>
          <Text style={styles.userSubtitle}>Flash student</Text>
        </View>
      </View>

      <View style={styles.sections}>
        {/* API Key section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OpenAI API Key</Text>
          <Text style={styles.sectionDesc}>
            Your key is stored on-device only and never sent to our servers.
            Required to generate flashcards and quizzes.
          </Text>

          {statusMessage ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          ) : null}

          <SectionCard>
            <PrefRow
              label="API Key"
              desc="Get your key at platform.openai.com"
              right={null}
            />
            <View style={styles.apiKeyRow}>
              <TextInput
                style={styles.apiInput}
                placeholder="sk-..."
                placeholderTextColor={colors.fg3}
                value={apiKey}
                onChangeText={(t) => {
                  setApiKeyInput(t);
                  setSavedOk(false);
                }}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <View style={styles.apiKeyActions}>
              <TouchableOpacity
                style={[styles.saveBtn, savedOk && styles.saveBtnOk]}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>
                  {savedOk ? "✓ Saved" : "Save Key"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </SectionCard>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SectionCard>
            <PrefRow
              label="Study Reminders"
              desc="Daily notifications to keep you on track"
              right={
                <Toggle
                  on={notifications}
                  onToggle={() => setNotifications((n) => !n)}
                />
              }
            />
            <View style={styles.rowDivider} />
            <PrefRow
              label="Dark Mode"
              desc="Coming soon"
              right={
                <Toggle
                  on={darkMode}
                  onToggle={() => setDarkMode((d) => !d)}
                />
              }
            />
          </SectionCard>
        </View>

        {/* Account info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SectionCard>
            {[
              ["Signed in as", user?.username || "Unknown"],
              ["Version", "1.0.0"],
              ["Backend", "Django REST API"],
            ].map(([k, v]) => (
              <View key={k}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoKey}>{k}</Text>
                  <Text style={styles.infoVal}>{v}</Text>
                </View>
                <View style={styles.rowDivider} />
              </View>
            ))}
          </SectionCard>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => dispatch(logoutUser())}
        >
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 40,
  },
  profileHero: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: isWeb ? 40 : 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.fg1,
  },
  userSubtitle: {
    fontSize: 13,
    color: colors.fg2,
    marginTop: 2,
  },
  sections: {
    padding: isWeb ? 40 : 20,
    maxWidth: isWeb ? 680 : undefined,
    gap: 28,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.fg1,
  },
  sectionDesc: {
    fontSize: 13,
    color: colors.fg2,
    lineHeight: 20,
  },
  statusBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  statusText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  prefCard: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingHorizontal: 20,
  },
  prefInfo: {
    flex: 1,
    marginRight: 16,
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.fg1,
    marginBottom: 2,
  },
  prefDesc: {
    fontSize: 12,
    color: colors.fg3,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 0,
  },
  apiKeyRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  apiInput: {
    backgroundColor: "#fff",
    borderRadius: radius.md,
    padding: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.fg1,
    borderWidth: 1.5,
    borderColor: colors.border,
    width: "100%",
  },
  apiKeyActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveBtnOk: {
    backgroundColor: colors.successDark,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  clearBtn: {
    backgroundColor: "#f1f5f9",
    borderRadius: radius.md,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  clearBtnText: {
    color: colors.fg2,
    fontWeight: "700",
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    paddingHorizontal: 20,
  },
  infoKey: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  infoVal: {
    fontSize: 13,
    color: colors.fg3,
    fontFamily: Platform.OS === "web" ? "monospace" : "Courier",
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    position: "relative",
    flexShrink: 0,
  },
  toggleOn: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    ...shadows.low,
  },
  toggleThumbOn: {
    left: 23,
  },
  logoutBtn: {
    backgroundColor: "#fee2e2",
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  logoutBtnText: {
    color: colors.errorDark,
    fontWeight: "700",
    fontSize: 15,
  },
});
