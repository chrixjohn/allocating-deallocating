import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Menu from "./HomeStack/Menu";
import Student from "./HomeStack/Students";
import Books from "./HomeStack/Books";
import Allocate from "./HomeStack/Allocate";
import Analytics from "./HomeStack/Analytics";

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Menu">
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{
          headerShown: false, // Hide the header
        }}
      />
      <Stack.Screen
        name="Students"
        component={Student}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Allocate"
        component={Allocate}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Books"
        component={Books}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Analytics"
        component={Analytics}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
