import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginUser } from "../store/authSlice";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ username, password })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigation.replace("Home");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Flash</Text>
      <Text style={styles.subheading}>Study smarter, not harder</Text>

      {error ? <Text style={styles.error}>{JSON.stringify(error)}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={(t) => {
          setUsername(t);
          dispatch(clearError());
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          dispatch(clearError());
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f7fb",
  },
  heading: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#4361ee",
    fontSize: 14,
  },
  error: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 12,
  },
});
