import React, { useEffect, useState } from "react";
import { Appbar, Text, ActivityIndicator } from "react-native-paper";
import { StyleSheet, View, ScrollView, Animated, Easing, StatusBar, } from "react-native";
import * as SecureStore from "expo-secure-store";

const BookBox = ({ book, index }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity animation

  useEffect(() => {
    // Start opacity animation with delay when component mounts
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duration of animation in milliseconds
      easing: Easing.linear, // Easing function
      delay: index * 50, // Delay each BookBox by 500 milliseconds
      useNativeDriver: true, // Use native driver for better performance
    });
    animation.start();
    return () => animation.stop(); // Cleanup animation
  }, []);

  return (
    <Animated.View style={[styles.bookBox, { opacity: fadeAnim }]}>
      <Text style={styles.bookId}>{book.id}</Text>
      <Text style={styles.bookText}>{book.name}</Text>
    </Animated.View>
  );
};
export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity animation

  const fetchBooks = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        "https://sunday-library.onrender.com/teacher/freebooks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-authtoken": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const responseData = await response.json();
      setBooks(responseData);
      setLoading(false);
      animateAppbar(); // Start animation after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Ensure loading state is set to false even on error
    }
  };

  const animateAppbar = () => {
    // Start opacity animation for Appbar
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duration of animation in milliseconds
      easing: Easing.linear, // Easing function
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#155cd4" barStyle="light-content" />
      <View style={styles.mainContainer}>
        <Animated.View style={[styles.appbar, { opacity: fadeAnim }]}>
          <Text style={styles.appbarText}>Books</Text>
        </Animated.View>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#0000ff"
            />
          ) : books.length === 0 ? (
            <Text style={styles.noBooksText}>No Books Available</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {books.map((book, index) => (
                <BookBox key={index} book={book} index={index} />
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
    justifyContent: "flex-end", // Align content to the bottom
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
    height: "85%", // Adjust height as needed
    width: "100%",
    borderTopLeftRadius: 20, // Border radius at the top left
    borderTopRightRadius: 20, // Border radius at the top right
    borderBottomLeftRadius: 0, // No border radius at the bottom left
    borderBottomRightRadius: 0, // No border radius at the bottom right
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
    color:"#EE0823",
    letterSpacing: 0.5,
    marginBottom: 5, // Added margin bottom for spacing
  },
  bookText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noBooksText: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: "red",
    marginTop: 18,
    textAlign: "center",
    fontWeight:"700",
  },
});
