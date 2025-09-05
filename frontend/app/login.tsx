import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../types/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled automatically by the auth state change
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first");
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        "Password Reset",
        "A password reset email has been sent to your email address. Please check your inbox."
      );
    } catch (error: any) {
      Alert.alert("Password Reset Error", error.message);
    }
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
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupButtonContainer}>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign up</Text>
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
  loginButton: {
    backgroundColor: "#002aff",
    borderRadius: 24,
    paddingVertical: 12,
    width: 220,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  signupButtonContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  signupButton: {
    backgroundColor: "#ff0080",
    borderRadius: 24,
    paddingVertical: 12,
    width: 220,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPasswordButton: {
    marginTop: 16,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#002aff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
