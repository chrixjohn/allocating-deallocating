import React, { useEffect, useState } from "react";
import { Appbar, Text, ActivityIndicator } from "react-native-paper";
import { StyleSheet, View, ScrollView, Animated, Easing, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import NetInfo from "@react-native-community/netinfo";

const StudentBox = ({ student, index }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      delay: index * 50,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.studentBox, { opacity: fadeAnim }]}>
      <Text style={styles.studentId}>{student.id}</Text>
      <Text style={styles.studentName}>{student.name}</Text>
    </Animated.View>
  );
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchStudents = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        "https://sunday-library.onrender.com/teacher/students",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-authtoken": token,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Server not found");
        } else {
          throw new Error("Failed to fetch students");
        }
      }

      const responseData = await response.json();
      setStudents(responseData);
      setLoading(false);
      animateAppbar();
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      if (error.message === "Server not found") {
        Alert.alert("Server Not Found", "The server could not be reached.");
      }
    }
  };

  const animateAppbar = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>No Internet Connection</Text>
        </View>
      )}
      <View style={styles.mainContainer}>
        <Animated.View style={[styles.appbar, { opacity: fadeAnim }]}>
          <Text style={styles.appbarText}>Students</Text>
        </Animated.View>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#0000ff"
            />
          ) : students.length === 0 ? (
            <Text style={styles.noStudentsText}>No Students Available</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {students.map((student, index) => (
                <StudentBox
                  key={index}
                  student={student}
                  index={index}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
    height: "85%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#e6e6e6",
    bottom: -1,
    shadowOffset: { width: -2, height: 2 },
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#155cd4",
    justifyContent: "flex-end",
  },
  appbar: {
    backgroundColor: "#155cd4",
    height: 64,
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  appbarText: {
    color: "white",
    fontSize: 25,
    fontWeight: "700",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },
  noStudentsText: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: "red",
    marginTop: 18,
    textAlign: "center",
    fontWeight: "700",
  },
  studentBox: {
    backgroundColor: "#3278D680",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
  },
  studentId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#EE0823",
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  connectionStatus: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  connectionText: {
    color: "white",
    fontSize: 16,
  },
});
