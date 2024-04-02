import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation and useRoute hooks

import HomeScreen from "./MainNav/Home";
import InfoScreen from "./MainNav/Info";
import SettingsScreen from "./MainNav/Settings";

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  const route = useRoute(); // Get the route object
  const navigation = useNavigation(); // Get the navigation object

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
        headerShadowVisible: false, // Remove header shadow
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'St Marys Sunday School',
          headerStyle: { backgroundColor: '#155cd4' },
          headerTitleStyle: { fontWeight: '900',color:'#ffff' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-sharp" size={size} color={color} />
          ),
          headerLeft: () => {
            if (route.name !== "Home") { // Check if the current route is not the initial screen
              return (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color="white"
                  style={{ marginLeft: 10 }}
                  onPress={() => navigation.goBack()}
                />
              );
            }
            return null;
          },
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: 'St Marys Sunday School',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
