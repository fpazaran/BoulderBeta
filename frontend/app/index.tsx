import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from '../types/navigation';

export default function Index() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const testing = true;

  const handleLogin = () => {
    testing ? navigation.replace('MainTabs') : navigation.navigate('Login');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Boulder Beta</Text>
        <View style={styles.underline} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  underline: {
    marginTop: 4,
    height: 4,
    width: 220,
    backgroundColor: '#ff0080',
    borderRadius: 2,
  },
  button: {
    backgroundColor: '#ff0080',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: 220,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
