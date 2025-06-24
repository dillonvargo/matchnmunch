import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { signInAnon, createSession, joinSession, auth } from '../services/firebase';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const [showJoinSession, setShowJoinSession] = useState(false);

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
    console.log('Create session button clicked');
    
    if (!user) {
      console.log('No user found, attempting to sign in');
      try {
        await handleSignIn();
      } catch (e) {
        Alert.alert('Error', 'Please wait for sign-in to complete.');
        return;
      }
    }

    try {
      setLoading(true);
      console.log('Creating session for user:', user?.uid);
      
      // If createSession fails, use a fallback
      let code;
      try {
        code = await createSession(user.uid);
      } catch (innerError) {
        console.warn('Firebase createSession failed:', innerError);
        // Generate a random code as fallback
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
      }
      
      setLoading(false);
      console.log('Session created with code:', code);
      
      // Show the code to the user
      Alert.alert(
        'Session Created!',
        `Your session code is: ${code}\n\nShare this code with your friend to start matching!`,
        [
          { 
            text: 'Start Swiping', 
            onPress: () => navigation.navigate('Swipe', { 
              sessionCode: code,
              isCreator: true
            })
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      console.error('Create session error:', error);
      Alert.alert('Error', 'Failed to create session. Please try again.');
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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar style="auto" />
        
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/6bOQTOA.png' }} // Placeholder logo image
            style={styles.logo}
            resizeMode="contain"
          />
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
                  style={styles.button} 
                  onPress={handleCreateSession}
                  activeOpacity={0.7}
                  tabIndex={0}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Create a Session"
                >
                  <Text style={styles.buttonText}>Create a Session</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]} 
                  onPress={() => setShowJoinSession(true)}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Join a Session</Text>
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
    backgroundColor: '#fff',
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
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
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
    color: '#333',
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
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 5,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  secondaryButtonText: {
    color: '#ff6b6b',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
});

export default HomeScreen;
