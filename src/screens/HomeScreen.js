import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, findNodeHandle } from 'react-native';
import * as ReactNative from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signInAnon, createSession, joinSession, auth } from '../services/firebase';
import { colors, BackgroundPattern } from '../styles/theme';

// Custom Logo Component
const CustomLogo = () => {
  return (
    <View style={logoStyles.container}>
      {/* Left heart part */}
      <View style={logoStyles.heartPart}>
        <View style={[logoStyles.heartShape, {left: 0}]} />
      </View>
      {/* Right circle part */}
      <View style={logoStyles.circlePart}>
        <View style={logoStyles.circleShape} />
      </View>
    </View>
  );
};

const logoStyles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartPart: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  circlePart: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -30, // Overlap with heart
  },
  heartShape: {
    width: 75,
    height: 75,
    backgroundColor: '#f44336',
    borderTopLeftRadius: 37.5, 
    borderTopRightRadius: 37.5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 37.5,
    transform: [{rotate: '-45deg'}],
    borderWidth: 5,
    borderColor: colors.borderColor,
    zIndex: 1,
  },
  circleShape: {
    width: 75,
    height: 75,
    backgroundColor: colors.accent,
    borderRadius: 37.5,
    borderWidth: 5,
    borderColor: colors.borderColor,
  },
});

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const [showJoinSession, setShowJoinSession] = useState(false);
  
  // Reference to the container where we'll position the web button
  const newSessionContainerRef = useRef(null);

  // Check if user is already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        // Auto sign in anonymously
        handleSignIn();
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle anonymous sign in
  const handleSignIn = async () => {
    try {
      setLoading(true);
      const newUser = await signInAnon();
      setUser(newUser);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new session
  const handleCreateSession = async () => {
    if (!user) {
      Alert.alert('Error', 'Please wait for sign-in to complete before creating a session.');
      return;
    }

    try {
      setLoading(true);
      const newSessionCode = await createSession(user.uid);

      if (newSessionCode) {
        // Navigate directly on all platforms
        navigation.navigate('Swipe', {
          sessionCode: newSessionCode,
          isCreator: true,
        });
      } else {
        // Handle cases where session code might not be returned
        throw new Error('Failed to retrieve a valid session code.');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      Alert.alert('Error', 'Failed to create a new session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Join an existing session
  const handleJoinSession = async () => {
    if (!user) {
      Alert.alert('Error', 'Please wait for sign-in to complete.');
      return;
    }

    if (!sessionCode || sessionCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-character session code.');
      return;
    }

    try {
      setLoading(true);
      await joinSession(sessionCode.toUpperCase(), user.uid);
      setLoading(false);
      
      navigation.navigate('Swipe', { 
        sessionCode: sessionCode.toUpperCase(),
        isCreator: false
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to join session. Please check the code and try again.');
      console.error('Join session error:', error);
    }
  };

  // Function to create and position the web button
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Remove any existing button first
      const existingButton = document.querySelector('[data-component-name="<button />"]');
      if (existingButton) {
        existingButton.remove();
      }
      
      // Create web button function
      const createWebButton = () => {
        // Get the position of our container
        if (newSessionContainerRef.current && typeof document !== 'undefined') {
          const containerElement = ReactNative.findNodeHandle(newSessionContainerRef.current);
          if (containerElement) {
            const domNode = document.querySelector(`[data-reactroot=""] [aria-label="New Session"]`);
            if (domNode) {
              // Create a real HTML button
              const webButton = document.createElement('button');
              webButton.innerText = 'New Session';
              webButton.style.width = '80%';
              webButton.style.padding = '15px 30px';
              webButton.style.backgroundColor = '#7851a9';
              webButton.style.color = '#f8f0d8';
              webButton.style.border = 'none';
              webButton.style.borderRadius = '30px';
              webButton.style.fontWeight = 'bold';
              webButton.style.fontSize = '24px';
              webButton.style.cursor = 'pointer';
              webButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.15)';
              webButton.style.marginBottom = '20px';
              webButton.style.textAlign = 'center';
              webButton.style.zIndex = 1000;

              // Position in place of the React Native button
              const rect = domNode.getBoundingClientRect();
              webButton.style.position = 'absolute';
              webButton.style.top = `${rect.top}px`;
              webButton.style.left = `${rect.left}px`;
              webButton.style.width = `${rect.width}px`;
              webButton.style.height = `${rect.height}px`;
              
              // Add click event
              webButton.onclick = () => {
                handleCreateSession();
              };
              
              // Add hover effects
              webButton.onmouseover = () => {
                webButton.style.backgroundColor = '#653d96';
                webButton.style.transform = 'scale(1.03)';
              };
              
              webButton.onmouseout = () => {
                webButton.style.backgroundColor = '#7851a9';
                webButton.style.transform = 'scale(1)';
              };
              
              // Hide the React Native button
              if (domNode) {
                domNode.style.opacity = '0';
              }
              
              // Add to document
              document.body.appendChild(webButton);
              return webButton;
            }
          }
        }
        return null;
      };
      
      // Initial creation
      let webButton = createWebButton();
      
      // Reposition on resize
      const handleResize = () => {
        if (webButton) {
          webButton.remove();
        }
        webButton = createWebButton();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
        if (webButton) {
          webButton.remove();
        }
      };
    }
  }, [showJoinSession]);
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BackgroundPattern />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar style="light" />
        
        <View style={styles.logoContainer}>
          <CustomLogo />
          <Text style={styles.appName}>Match & Munch</Text>
          <Text style={styles.tagline}>Find the perfect movie and food combo!</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#ff6b6b" />
        ) : (
          <View style={styles.actionContainer}>
            {!showJoinSession ? (
              <>
                <TouchableOpacity 
                  ref={newSessionContainerRef}
                  style={styles.button}
                  onPress={handleCreateSession}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="New Session"
                  role="button"
                >
                  <Text style={styles.buttonText}>New Session</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]} 
                  onPress={() => setShowJoinSession(true)}
                >
                  <Text style={styles.buttonText}>Join Session</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Enter 6-character session code:</Text>
                <TextInput
                  style={styles.input}
                  value={sessionCode}
                  onChangeText={setSessionCode}
                  placeholder="ABCDEF"
                  placeholderTextColor="#999"
                  maxLength={6}
                  autoCapitalize="characters"
                />
                
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleJoinSession}
                >
                  <Text style={styles.buttonText}>Join Session</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]} 
                  onPress={() => setShowJoinSession(false)}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Find your perfect movie night combo!
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginBottom: 10,
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  tagline: {
    fontSize: 16,
    color: colors.primaryText,
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondaryText,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: colors.primaryText,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 5,
  },
  button: {
    width: '80%',
    height: 60,
    backgroundColor: colors.primaryButton,
    borderRadius: 30, // Fully rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 24,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.primaryButton,
  },
  secondaryButtonText: {
    color: colors.buttonText,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: colors.primaryText,
    fontSize: 14,
  },
});

export default HomeScreen;
