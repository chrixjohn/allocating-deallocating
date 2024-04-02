import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Animated, // Import Animated from React Native
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import * as SecureStore from "expo-secure-store";
import { StackActions } from '@react-navigation/native';

const logo = require("../../../assets/logo.png");

export default function LoginForm() {
  const navigation = useNavigation();
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initialize fadeAnim with a starting value of 0

  useEffect(() => {
    fadeIn(); // Call the fadeIn function when the component mounts
    checkToken();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Set the duration of the animation
      useNativeDriver: true,
    }).start();
  };

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      navigation.dispatch(StackActions.replace('Main'));
    }
  };

  const handleForgot = () => {
    navigation.navigate("Forgot");
  };

  const handleLogin = () => {
    if (isLoading) return; // Prevent multiple requests while loading
    setIsLoading(true); // Set loading state to true

    fetch("https://sunday-library.onrender.com/" + "teacher/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: teacherId,
        password: password,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          setPassword("");
          setTeacherId("");
          const token = response.headers.get("x-authtoken");
          await SecureStore.setItemAsync("token", token);
          navigation.dispatch(StackActions.replace('Main'));
        } else {
          alert("Invalid credentials. Please try again.");
        }
      })
      .catch(() => {
        alert("An error occurred. Please try again later.");
      })
      .finally(() => {
        console.log("chris");
        setIsLoading(false); // Set loading state to false after request completes
      });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Sunday School Library</Text>
      <Image source={logo} style={styles.logo} />
      <View style={styles.inputView}>
        <FontAwesome name="user" size={24} color="#003f5c" style={styles.icon} /> 
        <TextInput
          value={teacherId}
          style={styles.inputText}
          placeholder="Teacher ID"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setTeacherId(text)}
        />
      </View>
      <View style={styles.inputView}>
        <FontAwesome name="lock" size={24} color="#003f5c" style={styles.icon} /> 
        <TextInput
          value={password}
          secureTextEntry
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}> 
        <Text style={styles.loginText}>{isLoading ? 'Loading...' : 'LOGIN'}</Text> 
      </TouchableOpacity>
      <TouchableOpacity onPress={handleForgot}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3F0",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#003f5c",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputText: {
    height: 50,
    color: "#003f5c",
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontSize: 18,
  },
  forgot: {
    color: "blue",
    fontSize: 16,
    marginTop: 10,
  },
});
