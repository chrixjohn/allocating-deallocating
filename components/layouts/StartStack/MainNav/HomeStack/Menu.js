import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Animated,
  
} from "react-native";
import { Appbar, Avatar } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import * as SecureStore from "expo-secure-store";
import { StatusBar } from 'expo-status-bar';

const BoxComponent = ({ text, imageSource }) => (
  <Animated.View animation="fadeIn" duration={1000} style={[styles.box]}>
    <Image source={imageSource} style={styles.boxImage} />
    <Text style={styles.boxText}>{text}</Text>
  </Animated.View>
);

function Menu() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const response = await fetch(
          "https://sunday-library.onrender.com/teacher/details",
          {
            method: "GET",
            headers: {
              "x-authtoken": token,
            },
          }
        );
        const teacher = await response.json();
        setName(teacher.name);
        setLoading(false);
        animateName();
      } catch (error) {
        console.error("Error fetching or decoding token:", error);
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  const animateName = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Use useFocusEffect to change status bar color when Menu screen is focused
  // useFocusEffect(
  //   React.useCallback(() => {
  //     StatusBar.setBackgroundColor("#155cd4"); // Set status bar background color to blue
  //     StatusBar.setBarStyle("light-content"); // Set status bar content color to light
  //     return () => {
  //       // Reset status bar color when leaving Menu screen
  //       StatusBar.setBackgroundColor("transparent"); // Reset status bar background color
  //       StatusBar.setBarStyle("dark-content"); // Set status bar content color to dark
  //     };
  //   }, [])
  // );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#155cd4" barStyle="light-content" />
      <View style={styles.mainContainer}>
        <Appbar style={styles.appbar}>
          <View style={styles.appbarContent}>
            <Text style={styles.appbarText}>Welcome</Text>
            <Animated.Text
              style={[
                styles.appbarName,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              {loading ? "" : name}
            </Animated.Text>
          </View>
        </Appbar>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ffff"
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        ) : (
          <View style={styles.container}>
            <View style={styles.columnContainer}>
              <TouchableOpacity
                style={styles.columnContainer}
                onPress={() => navigation.navigate("Students")}
              >
                <BoxComponent
                  text="Students"
                  imageSource={require("../../../../../assets/students.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.columnContainer}
                onPress={() => navigation.navigate("Allocate")}
              >
                <BoxComponent
                  text="Allocate"
                  imageSource={require("../../../../../assets/allocate.png")}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.columnContainer}>
              <TouchableOpacity
                style={styles.columnContainer}
                onPress={() => navigation.navigate("Books")}
              >
                <BoxComponent
                  text="Books"
                  imageSource={require("../../../../../assets/books.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.columnContainer}
                onPress={() => navigation.navigate("Analytics")}
              >
                <BoxComponent
                  text="Analytics"
                  imageSource={require("../../../../../assets/analytics.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "#155cd4",
    color: "black",
    height: 64,
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  appbarContent: {
    flexDirection: "column",
  },
  appbarText: {
    color: "white",
    fontSize: 25,
    fontWeight: "700",
  },
  appbarName: {
    color: "white",
    fontSize: 25,
    fontWeight: "700",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#155cd4",
    justifyContent: "flex-end",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    height: "80%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#e6e6e6",
    bottom: -1,
  },
  boxImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  boxText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a7cd4",
    margin: 20,
    borderRadius: 10,
  },
  columnContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  avatar: {
    marginRight: 10,
  },
});

export default Menu;
