import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const colors = {
  background: '#f47360', // Coral background
  primaryText: '#f8f0d8', // Cream/off-white
  secondaryText: '#333',
  primaryButton: '#7851a9', // Purple
  buttonText: '#fff',
  accent: '#ffca28', // Yellow from logo
  error: '#ff6b6b', // Red for errors
  cardBackground: '#f8f0d8',
  borderColor: '#8b2027', // Dark red from logo
  likeButton: '#4ecdc4', // Teal for like
  nopeButton: '#ff6b6b', // Coral-red for nope
};

// Background Pattern Component with food and movie icons
export const BackgroundPattern = () => {
  return (
    <View style={bgStyles.container}>
      <Text style={[bgStyles.icon, {top: '5%', left: '10%'}]}>🍿</Text>
      <Text style={[bgStyles.icon, {top: '15%', right: '15%'}]}>🎬</Text>
      <Text style={[bgStyles.icon, {top: '25%', left: '25%'}]}>🥤</Text>
      <Text style={[bgStyles.icon, {top: '10%', right: '10%'}]}>🍔</Text>
      <Text style={[bgStyles.icon, {top: '40%', left: '5%'}]}>📹</Text>
      <Text style={[bgStyles.icon, {bottom: '30%', right: '20%'}]}>🍕</Text>
      <Text style={[bgStyles.icon, {bottom: '20%', left: '25%'}]}>🎞️</Text>
      <Text style={[bgStyles.icon, {bottom: '40%', right: '5%'}]}>🍬</Text>
      <Text style={[bgStyles.icon, {bottom: '10%', left: '15%'}]}>🎟️</Text>
      <Text style={[bgStyles.icon, {bottom: '15%', right: '15%'}]}>🌭</Text>
    </View>
  );
};

const bgStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
    zIndex: -1,
  },
  icon: {
    position: 'absolute',
    fontSize: 30,
    opacity: 0.7,
    color: colors.borderColor,
    transform: [{rotate: '0deg'}]
  }
});
