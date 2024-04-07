import React, { useEffect, useState } from "react";
import { Appbar, ActivityIndicator } from "react-native-paper";
import { StyleSheet, View, Text, ScrollView, Animated } from "react-native";
import * as SecureStore from "expo-secure-store";

const BoxComponent = ({ allocation, index }) => {
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      delay: index * 50, // Delay each BoxComponent by 500 milliseconds
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop(); // Cleanup animation
  }, []);

  if (!allocation || !allocation.student_name || !allocation.books) {
    console.log("Allocation data is null or incomplete");
    return null;
  }

  return (
    <Animated.View style={[styles.bookBox, { opacity }]}>
      <Text style={styles.studentName}>{allocation.student_name}</Text>
      {allocation.books.map((book, index) => {
        console.log("Book object:", book);
        return (
          <View key={index} style={styles.bookContainer}>
            <Text style={styles.bookId}>{book.book_id}</Text>
            <Text style={styles.bookText}>{book.book_name}</Text>
          </View>
        );
      })}
    </Animated.View>
  );
};

export default function Analytics() {
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllocation = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        "https://sunday-library.onrender.com" + "/teacher/viewallocation",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-authtoken": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch details");
      }

      const responseData = await response.json();
      console.log("chris joyhn", responseData.data[0]);
      setAllocation(responseData.data);
      setLoading(false);
      console.log("chris joyhn", responseData.data[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <Appbar style={styles.appbar}>
          <Text style={styles.appbarText}>Analytics</Text>
        </Appbar>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#0000ff"
            />
          ) : allocation.length === 0 ? (
            <Text style={styles.noDataText}>No Allocation Data Available</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {allocation.map((allocati, index) => (
                <BoxComponent
                  key={index}
                  allocation={allocati}
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
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#155cd4",
    justifyContent: "flex-end",
  },
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
  bookBox: {
    backgroundColor: "#3278D680",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
  },
  bookId: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
    color:"#EE0823",
    letterSpacing: 0.5,
  },
  bookText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
  noDataText: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: "red",
    marginTop: 18,
    textAlign: "center",
    fontWeight: "700",
  },
  bookContainer: {
    marginBottom: 0,
  },
  bookName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
