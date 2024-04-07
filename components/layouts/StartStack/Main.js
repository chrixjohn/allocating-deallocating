import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./MainNav/Home";
import SettingsScreen from "./MainNav/Settings";

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: '#ffff',
          color: '#ffff',
          borderColor: 'blue',
        },
        tabBarLabelStyle: {
          fontWeight: '500',
          color: '#000',
        },
        tabBarIconStyle: {
          // Any specific styles for tabBarIcon can be added here
        },
        headerShown: false, // Hide the header by default
        headerShadowVisible: false, // Remove header shadow
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" size={size} color={color} />
          ),
        }}
      />

<Tab.Screen
  name="UserDetails"
  component={SettingsScreen}
  options={({ navigation }) => ({
    headerShown: true,
    headerTitle: 'St Marys Sunday School',
    headerTitleStyle: { fontWeight: '900' },
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack(navigation)}>
        <Ionicons name="chevron-back-outline" size={24} color="black" style={{ marginLeft: 15 }} />
      </TouchableOpacity>
    ),
    tabBarIcon: ({ color, size }) => (
      <FontAwesome name="user" size={size} color={color} />
    ),
  })}
/>
    </Tab.Navigator>
  );
}
