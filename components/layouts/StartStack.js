import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import LoginScreen from "./StartStack/Login";
import MainScreen from "./StartStack/Main";
import ForgotScreen from "./StartStack/Forgot";

const Stack = createStackNavigator();

const StartStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false ,
          animation: 'slide_from_bottom',}} // Remove the header for the Login screen
      />
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Forgot" component={ForgotScreen} />
    </Stack.Navigator>
  );
};

export default StartStack;
