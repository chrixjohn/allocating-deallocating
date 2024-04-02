import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const ForgotPasswordScreen = () => {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true); // Set loading state to true when sending request
      const response = await fetch("https://sunday-library.onrender.com/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Send the value from the input box as the ID
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Password Reset", "Check your mail for further instructions");
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to reset password. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="ID"
        value={id}
        onChangeText={(text) => setId(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={loading} // Disable the button when loading is true
      >
        <Text style={styles.buttonText}>{loading ? "Loading..." : "Reset"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF3F0",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
  },
  input: {
    width: "75%",
    height: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "33%",
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
