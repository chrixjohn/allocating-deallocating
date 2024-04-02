import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for icons
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch("https://sunday-library.onrender.com/teacher/details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-authtoken": token,
        },
      });
      const data = await response.json();
      setUserDetails(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync("token");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Details</Text>
      <View style={styles.userDetailsContainer}>
        {userDetails ? (
          <>
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="user" size={24} color="#007bff" style={styles.icon} />
                <Text style={styles.label}>Name</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={userDetails.name}
                editable={false}
                placeholderTextColor="#555"
              />
            </View>
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="envelope" size={24} color="#007bff" style={styles.icon} />
                <Text style={styles.label}>Email</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={userDetails.email}
                editable={false}
                placeholderTextColor="#555"
              />
            </View>
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="graduation-cap" size={24} color="#007bff" style={styles.icon} />
                <Text style={styles.label}>Class Name</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={userDetails.classname}
                editable={false}
                placeholderTextColor="#555"
              />
            </View>
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="users" size={24} color="#007bff" style={styles.icon} />
                <Text style={styles.label}>Students</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={userDetails.student_count}
                editable={false}
                placeholderTextColor="#555"
              />
            </View>
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome name="book" size={24} color="#007bff" style={styles.icon} />
                <Text style={styles.label}>Allocated Books</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={userDetails.allocated_books_count}
                editable={false}
                placeholderTextColor="#555"
              />
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 0,
    fontWeight: "bold",
    color: "#000000",
  },
  userDetailsContainer: {
    alignItems: "flex-start",
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: 20,
    width: "100%", // Set width to 100%
  },
  label: {
    fontSize: 20, // Increase font size
    marginLeft: 5, // Add margin to separate icon and label
    color: "#333",
    fontWeight: "bold", // Make text bold
  },
  textInput: {
    width: "100%", // Set width to 100%
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    color: "#333", // Set text color
    marginTop: 0, // Add margin to place it from
    fontSize: 16, // Increase font size
    fontWeight: "600", // Make text bold
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
});
