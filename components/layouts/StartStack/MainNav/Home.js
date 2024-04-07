import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';


// Screens
import Menu from "./HomeStack/Menu";
import Student from "./HomeStack/Students";
import Books from "./HomeStack/Books";
import Allocate from "./HomeStack/Allocate";
import Analytics from "./HomeStack/Analytics";

const Stack = createStackNavigator();

const HomeStack = () => {
  const goBack = (navigation) => {
    navigation.goBack();
  };

  return (
    <Stack.Navigator initialRouteName="Menu">
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={({ navigation }) => ({
          
          headerTitle: 'St Marys Sunday School',
          headerStyle: { backgroundColor: '#155cd4' },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
            color:'#ffff',
            marginLeft:8,
          },
        })}
      />
      <Stack.Screen
        name="Students"
        component={Student}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => goBack(navigation)}>
        <Ionicons name="chevron-back-outline" size={24} color="white" style={{ marginLeft: 15 }} />
      </TouchableOpacity>
          ),
          headerTitle: 'St Marys Sunday School',
          headerStyle: { backgroundColor: '#155cd4' },
          
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
            color:'#ffff'
          },
        })}
      />
      <Stack.Screen
        name="Allocate"
        component={Allocate}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => goBack(navigation)}>
        <Ionicons name="chevron-back-outline" size={24} color="white" style={{ marginLeft: 15 }} />
      </TouchableOpacity>
          ),
          headerTitle: 'St Marys Sunday School',
          headerStyle: { backgroundColor: '#155cd4' },
          
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
            color:'#ffff'
          },
        })}
      />
      <Stack.Screen
        name="Books"
        component={Books}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => goBack(navigation)}>
        <Ionicons name="chevron-back-outline" size={24} color="white" style={{ marginLeft: 15 }} />
      </TouchableOpacity>
          ),
          headerTitle: 'St Marys Sunday School',
          headerStyle: { backgroundColor: '#155cd4' },
          
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "bold",
            color:'#ffff'
          },
        })}
      />
      <Stack.Screen
  name="Analytics"
  component={Analytics}
  options={({ navigation }) => ({
    headerLeft: () => (
      <TouchableOpacity onPress={() => goBack(navigation)}>
        <Ionicons name="chevron-back-outline" size={24} color="white" style={{ marginLeft: 15 }} />
      </TouchableOpacity>
    ),
    headerTitle: 'St Marys Sunday School',
    headerStyle: { backgroundColor: '#155cd4' },
    headerShadowVisible: false,
    headerTitleStyle: {
      fontWeight: "bold",
      color:'#ffff'
    },
  })}
/>
    </Stack.Navigator>
  );
};

export default HomeStack;
