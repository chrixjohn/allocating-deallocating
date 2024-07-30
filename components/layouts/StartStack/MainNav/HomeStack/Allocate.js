import React, { useEffect, useState } from "react";

import { Appbar, Avatar, ActivityIndicator, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,StatusBar, Switch,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as SecureStore from "expo-secure-store";

import DropDownPicker from "react-native-dropdown-picker";

const BoxComponent = ({
  text,
  data,
  student,
  onSelectBook,
  availableBooks,
  index,
}) => {
  const id = student.id;
  const [value, setValue] = useState(null);
  const [placeholderText, setPlaceholderText] = useState("Select Book");
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity animation

  useEffect(
    () => {
      const animation = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Duration of animation in milliseconds
        easing: Easing.linear, // Easing function
        delay: index * 50, // Delay each BookBox by 500 milliseconds
        useNativeDriver: true, // Use native driver for better performance
      });
      animation.start();
      setValue(null); // Reset selected value when the component re-renders
      return () => animation.stop(); // Cleanup animation
    },
    [index],
    [availableBooks]
  ); // Reset selected value when availableBooks changes

  const handleValueChange = (item) => {
    setValue(item.value);
    onSelectBook(id, item.value); // Update parent state when value changes
    setPlaceholderText(item.label); // Set the placeholder text to the selected book label
  };

  return (
    <Animated.View style={[styles.box, { opacity: fadeAnim }]}>
      <View style={styles.boxContent}>
        <Text style={styles.studentName}>{text}</Text>
      </View>
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={availableBooks}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeholderText}
          searchPlaceholder="Search..."
          value={value}
          onChange={handleValueChange} // Call handleValueChange directly
        />
      </View>
    </Animated.View>
  );
};

const returnBook = async (bookIds, callback) => {
  console.log("Deallocating books with IDs:", JSON.stringify(bookIds));

  const token = await SecureStore.getItemAsync("token");
  fetch("https://sunday-library.onrender.com/teacher/deallocate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-authtoken": token,
    },
    body: JSON.stringify({ bookIds }), // Pass array of bookIds in the body
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        alert("Books deallocated Successfully");
      } else {
        alert("Error: No Books Available to Deallocate");
      }
      console.log("Return Books Response:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      console.log("Deallocate process completed");
      callback(); // Call the callback function to reset loading state after request completes
    });
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookId, setBookId] = useState("");
  const [selectedBooks, setSelectedBooks] = useState({}); // State to store selected book ID for each student
  const [availableBooks, setAvailableBooks] = useState([]); // State to store available books for each student
  const [allocatedBooks, setAllocatedBooks] = useState([]); // State to store allocated books
  const [selectedItems, setSelectedItems] = useState([]);
  const [freeItems, setFreeItems] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [selectedChart, setselectedChart] = useState("Allocate");
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState([]);
  const CustomTickIcon = () => <Icon name="times" size={16} color="black" />;

  const toggleChart = (chartType) => {
    setselectedChart(chartType);
    // Toggle between pages based on the selected chart type
    if (chartType === "Deallocate") {
      fetchData(); // Fetch data if not already fetched
      console.log("deallocate");
      setDataFetched(true); // Set dataFetched to true to avoid fetching data multiple times
    } else if (chartType === "Allocate") {
      setAvailableBooks([]);
      setSelectedBooks([]);
      fetchData(); // Fetch data if not already fetched
      console.log("allocate");

      setDataFetched(true); // Set dataFetched to true to avoid fetching data multiple times
    }
  };
  const ClearallocateBooks = async () => {
    setLoading(true); // Set loading state to true when clearing allocated books

    try {
      // Clear selected books and available books
      setSelectedBooks({});
      setAvailableBooks([]);
      // Fetch fresh data
      await fetchData();
      //alert("Books Cleared Successfully");
    } catch (error) {
      console.error("Error:", error);
      //alert("Error Clearing Books");
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      // Fetching Allocated Books
      const responseallocated = await fetch(
        "https://sunday-library.onrender.com/teacher/allocatedbooks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-authtoken": token,
          },
        }
      );
      const responseD = await responseallocated.json();
      console.log("responseData:", responseData);

      // Access the data array from the response
      const allocatedDatas = responseD.data.map((item) => ({
        label: `${item.id} - ${item.name}`, // Concatenate book ID and name
        value: item.id, // Set the id property
      }));

      setFreeItems(allocatedDatas);
      console.log(freeItems);

      // Fetching Students
      let response = await fetch(
        "https://sunday-library.onrender.com/teacher/students",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-authtoken": token,
          },
        }
      );
      let responseData = await response.json();
      setStudents(responseData);

      // Fetching Books
      response = await fetch(
        "https://sunday-library.onrender.com/teacher/freebooks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-authtoken": token,
          },
        }
      );
      responseData = await response.json();
      console.log(responseData);
      const data = responseData.map((item) => ({
        label: `${item.id} - ${item.name} `, // Include both name and id in the label
        value: item.id,
      }));
      setBooks(data);
      setLoading(false);
      setAvailableBooks(data); // Initialize availableBooks with all books
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Ensure that useEffect runs only once on component mount

  const handleSelectBook = (studentId, bookId) => {
    const updatedSelectedBooks = { ...selectedBooks, [studentId]: bookId };
    setSelectedBooks(updatedSelectedBooks);

    // Update availableBooks for other students
    const remainingBooks = books.filter((book) => {
      return !Object.values(updatedSelectedBooks).includes(String(book.value));
    });
    setAvailableBooks(remainingBooks);
  };

  const allocateBooks = async () => {
    setLoading(true); // Set loading state to true when allocating books

    console.log("Selected Books:", selectedBooks);
    const convertedArray = Object.entries(selectedBooks).map(([sid, bid]) => ({
      sid: sid,
      bid: bid, // Assuming you want bid as a number
    }));

    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        "https://sunday-library.onrender.com/teacher/allocate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-authtoken": token,
          },
          body: JSON.stringify(convertedArray),
        }
      );
      const data = await response.json();

      if (data.status) {
        alert("Book allocated Successfully");
        fetchData(); // Refresh data after successful allocation
      } else {
        alert("Error Can't Allocate Book");
      }
      console.log("Allocate Books Response:", data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  const handleReturnBook = async () => {
    if (!loading) {
      setLoading(true); // Set loading state to true when deallocating book
      returnBook(currentValue, () => {
        fetchData(); // Refresh data after successful deallocation
        setLoading(false);
      }); // Call returnBook function with setLoading function
      setCurrentValue([]);
    }
  };

  return (
    <>
      <View style={styles.main}></View>
      <StatusBar backgroundColor="#155cd4" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedChart === "Allocate" && styles.selectedButton,
              selectedChart === "Allocate" && { color: "#fff" }, // Add this line
            ]}
            onPress={() => toggleChart("Allocate")}
          >
            <Text
              style={[
                styles.buttonText,
                selectedChart === "Allocate" && { color: "#fff" },
              ]}
            >
              Allocation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedChart === "Deallocate" && styles.selectedButton,
              selectedChart === "Deallocate" && { color: "#fff" }, // Add this line
            ]}
            onPress={() => toggleChart("Deallocate")}
          >
            <Text
              style={[
                styles.buttonText,
                selectedChart === "Deallocate" && { color: "#fff" },
              ]}
            >
              Deallocation
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {selectedChart === "Deallocate" ? (
            <>
              <View style={styles.deallocateContainer}>
                <View style={{ padding: 30 }}>
                  <DropDownPicker
                    items={freeItems}
                    open={isOpen}
                    setOpen={() => setIsOpen(!isOpen)}
                    value={currentValue}
                    setValue={(val) => setCurrentValue(val)}
                    maxHeight={300}
                    autoScroll
                    placeholder="Select books"
                    placeholderStyle={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                    BadgeIconComponent={CustomTickIcon} // Use custom tick icon component
                    showTickIcon={true}
                    showArrowIcon={true}
                    disableBorderRadius={true}
                    multiple={true}
                    mode="BADGE"
                    ModalProps={{ backdropPressToClose: true }} // Close dropdown on outside click
                  />
                </View>

                <Button
                  icon=""
                  mode="contained"
                  onPress={handleReturnBook}
                  style={[
                    styles.submitButton,
                    {
                      margin: 20,
                      backgroundColor: "#EE0823",
                      width: "33%",
                      alignSelf: "center",
                    },
                  ]}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator animating={true} color="#ffffff" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </View>
            </>
          ) : (
            <>
              {selectedChart === "Allocate" ? (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {loading ? ( // Check loading state
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : books.length === 0 && students.length === 0 ? (
                    <Text style={styles.noDataText}>
                      No Students & Books Available
                    </Text>
                  ) : students.length === 0 ? (
                    <Text style={styles.noDataText}>No Students Available</Text>
                  ) : books.length === 0 ? (
                    <Text style={styles.noDataText}>No Books Available</Text>
                  ) : (
                    students.map((student, index) => (
                      <View key={index} style={styles.boxRow}>
                        <BoxComponent
                          index={index}
                          student={student}
                          data={availableBooks}
                          text={<Text>{student.name}</Text>}
                          onSelectBook={handleSelectBook}
                          availableBooks={availableBooks}
                        />
                      </View>
                    ))
                  )}
                  {!loading && books.length > 0 && (
                    <View
                      style={{
                        marginVertical: 20,
                        flexDirection: "row",
                        margin: 15,
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        icon=""
                        mode="contained"
                        onPress={ClearallocateBooks}
                        style={[
                          styles.addButton,
                          {
                            backgroundColor: "#F20C0C",
                            color: "black",
                            //borderRadius: 15,
                            width: "40%",
                            alignSelf: "center",
                            // borderColor: "black", // Add border color
                            //borderWidth: 1, // Add border width
                          },
                        ]}
                      >
                        Clear
                      </Button>
                      <Button
                        icon=""
                        mode="contained"
                        onPress={allocateBooks}
                        style={[
                          styles.addButton,
                          {
                            backgroundColor: "#F20C0C",
                            width: "50%",
                            alignSelf: "center",
                          },
                        ]}
                      >
                        Submit
                      </Button>
                    </View>
                  )}
                </ScrollView>
              ) : null}
            </>
          )}
        </View>
      </View>

      <Appbar style={styles.appbar}>
        <Text style={styles.appbarText}>Allocation / Deallocation</Text>
      </Appbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    height: "85%",
    width: "100%",
    borderRadius: 20,
    borderColor: "#e6e6e6",
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#e6e6e6",
    bottom: -1,
  },
  main: {
    flex: 1,
    backgroundColor: "#155cd4",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  toggleContainer: {
    flexDirection: "row",
    margin: 10,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
    color: "#fff",
  },
  selectedButton: {
    backgroundColor: "#EE0823",
    color: "#fff",
  },
  selectedButtonText: {
    color: "#fff", // Set text color to white
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  deallocateContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  heading: {
    fontSize: 20,
    margin: 9,
    fontWeight: "bold",
    marginBottom: 0,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
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
  appbarText: {
    color: "white",
    fontSize: 25,
    fontWeight: "700",
    width: "100%",
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
  box: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#3278D680",
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
    height: 110,
    width: "90%",
    marginHorizontal: 20,
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 0,
    width: "100%",
    padding: 10,
  },
  dropdown: {
    justifyContent: "center",
    height: 40,
    marginBottom: -10,
    alignContent: "center",
    width: "100%",
    marginRight: -30,
    borderRadius: 10,
    borderColor: "#000000",
    borderWidth: 1,
    padding: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
