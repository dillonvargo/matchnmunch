import React, { useRef, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform } from 'react-native';
// Import web patch for button fix
import { applyWebPatches } from './src/webPatch';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import SwipeScreen from './src/screens/SwipeScreen';
import ResultScreen from './src/screens/ResultScreen';

// Initialize Firebase
import './src/services/firebase';

// Ignore specific Firebase warnings
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted from react-native core',
]);

const Stack = createStackNavigator();

export default function App() {


  // Create a navigation reference we can use throughout the app
  const navigationRef = useRef();
  
  // Apply web-specific patches on web platform
  useEffect(() => {
    // Only run on web platform
    if (Platform.OS === 'web') {
      console.log('Running on web, applying patches...');
      applyWebPatches();
    }
  }, []);
  
  // Store the navigation reference in the window object for access from anywhere
  if (typeof window !== 'undefined') {
    window.matchAndMunchNavigation = navigationRef.current;
  }
  
  return (
    <NavigationContainer
      ref={(navigation) => {
        navigationRef.current = navigation;
        if (typeof window !== 'undefined') {
          // Make navigation globally available
          window.matchAndMunchNavigation = navigation;
        }
      }}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Match & Munch' }} 
        />
        <Stack.Screen 
          name="Swipe" 
          component={SwipeScreen} 
          options={{ title: 'Find Your Match', headerBackTitle: 'Back' }} 
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{ title: 'Your Matches', headerBackTitle: 'Back' }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
