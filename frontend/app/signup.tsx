import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../types/navigation";

export default function Signup() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Add your signup logic here
    navigation.replace("MainTabs");
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Boulder Beta</Text>
          <View style={styles.underline} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username:"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Email:"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password:"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  underline: {
    marginTop: 4,
    height: 4,
    width: 220,
    backgroundColor: "#002aff",
    borderRadius: 2,
  },
  inputContainer: {
    width: 220,
    marginBottom: 18,
  },
  input: {
    height: 48,
    borderColor: "#002aff",
    borderWidth: 2,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#fff",
  },
  signupButton: {
    backgroundColor: "#002aff",
    borderRadius: 24,
    paddingVertical: 12,
    width: 220,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginButtonContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  loginButton: {
    backgroundColor: "#ff0080",
    borderRadius: 24,
    paddingVertical: 12,
    width: 220,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
