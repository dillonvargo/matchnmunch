import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously as firebaseSignInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
// Import environment variables disabled for demo
// import {
//   FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID
// } from '@env';

// Temporary Firebase configuration for demo purposes
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForMatchAndMunchApp123",
  authDomain: "match-and-munch-demo.firebaseapp.com",
  projectId: "match-and-munch-demo",
  storageBucket: "match-and-munch-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Anonymous sign-in (mock implementation for demo)
export const signInAnon = async () => {
  try {
    // Return a mock user object
    return {
      uid: 'demo-user-' + Math.random().toString(36).substring(2, 8),
      isAnonymous: true
    };
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

// Create a new session (mock implementation for demo)
export const createSession = async (userId) => {
  try {
    console.log('Creating session for user:', userId);
    
    // Generate a random 6-character code (uppercase letters and numbers)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    console.log('Created mock session with code:', code);
    
    // Store session in memory for demo purposes
    const sessionData = {
      createdAt: new Date().toISOString(),
      createdBy: userId,
      users: [userId],
      status: 'waiting',
      currentPhase: 'movies'
    };
    
    // Global variable as backup if localStorage fails
    if (typeof window !== 'undefined') {
      if (!window.matchMunchSessions) {
        window.matchMunchSessions = {};
      }
      
      // Store in our backup object
      window.matchMunchSessions[`session_${code}`] = sessionData;
    }
    
    // Try localStorage but don't require it
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`session_${code}`, JSON.stringify(sessionData));
        console.log('Session saved to localStorage');
      }
    } catch (storageError) {
      console.warn('LocalStorage not available:', storageError);
      // Continue with in-memory storage
    }
    
    return code;
  } catch (error) {
    console.error('Error creating session:', error);
    // Return a fallback code rather than throwing
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
};

// Join an existing session (mock implementation for demo)
export const joinSession = async (code, userId) => {
  try {
    console.log('Joining session with code:', code, 'for user:', userId);
    
    // For demo, we'll create a session if it doesn't exist
    let sessionData;
    let storedSession = null;
    
    // Safely try to get from localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        storedSession = localStorage.getItem(`session_${code}`);
      }
    } catch (storageError) {
      console.warn('LocalStorage not available:', storageError);
    }
    
    if (!storedSession) {
      // Create a new session for demo purposes
      sessionData = {
        createdAt: new Date().toISOString(),
        createdBy: 'other-user-123',
        users: ['other-user-123'],
        status: 'waiting',
        currentPhase: 'movies'
      };
      
      // Safely try to store in localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`session_${code}`, JSON.stringify(sessionData));
        }
      } catch (storageError) {
        console.warn('LocalStorage not available for writing:', storageError);
      }
    } else {
      sessionData = JSON.parse(storedSession);
    }
    
    // Check if session already has 2 users
    if (sessionData.users.length >= 2 && !sessionData.users.includes(userId)) {
      throw new Error('Session is full');
    }
    
    // Add user to session if not already included
    if (!sessionData.users.includes(userId)) {
      sessionData.users.push(userId);
      
      // Safely try to update localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`session_${code}`, JSON.stringify(sessionData));
        }
      } catch (storageError) {
        console.warn('LocalStorage not available for updating:', storageError);
      }
    }
    
    console.log('Joined mock session with code:', code);
    return sessionData;
  } catch (error) {
    console.error('Error joining session:', error);
    throw error;
  }
};

// Save user's swipe response (mock implementation for demo)
export const saveSwipeResponse = async (sessionCode, userId, itemId, response, category) => {
  try {
    console.log(`Saving ${category} response for item ${itemId}: ${response}`);
    
    // Get existing responses from localStorage or create new
    let userResponses = {};
    
    // Safely try to get from localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const storageKey = `responses_${sessionCode}_${userId}`;
        const storedResponses = localStorage.getItem(storageKey);
        if (storedResponses) {
          userResponses = JSON.parse(storedResponses);
        }
      }
    } catch (storageError) {
      console.warn('LocalStorage not available for reading responses:', storageError);
    }
    
    // Initialize category if it doesn't exist
    if (!userResponses[category]) {
      userResponses[category] = {};
    }
    
    // Save the response
    userResponses[category][itemId] = response;
    
    // Safely try to update localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const storageKey = `responses_${sessionCode}_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(userResponses));
      }
    } catch (storageError) {
      console.warn('LocalStorage not available for saving responses:', storageError);
    }
    
    console.log(`Saved ${category} response for item ${itemId}: ${response}`);
    return true;
  } catch (error) {
    console.error('Error saving swipe response:', error);
    throw error;
  }
};

// Check if both users have completed a category (mock implementation for demo)
export const checkCategoryCompletion = async (sessionCode, category) => {
  try {
    console.log(`Checking completion for category ${category} in session ${sessionCode}`);
    
    // For demo purposes, simulate a delay and then return true
    // This will allow the user to proceed without waiting for another user
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let sessionData = { currentPhase: category };
    
    // Safely try to get from localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const storedSession = localStorage.getItem(`session_${sessionCode}`);
        if (storedSession) {
          sessionData = JSON.parse(storedSession);
        }
      }
    } catch (storageError) {
      console.warn('LocalStorage not available for reading session:', storageError);
    }
    
    // Update session phase
    if (sessionData.currentPhase === category) {
      const nextPhase = category === 'movies' ? 'foods' : 'completed';
      sessionData.currentPhase = nextPhase;
      
      // Safely try to update localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`session_${sessionCode}`, JSON.stringify(sessionData));
        }
      } catch (storageError) {
        console.warn('LocalStorage not available for updating session:', storageError);
      }
    }
    
    console.log(`Category ${category} completed for session ${sessionCode}`);
    return true;
  } catch (error) {
    console.error('Error checking category completion:', error);
    throw error;
  }
};

// Get matches between users (mock implementation for demo)
export const getMatches = async (code) => {
  try {
    // For demo purposes, return some mock matches
    console.log(`Getting matches for session ${code}`);
    
    // Try to get responses from localStorage
    let user1Responses = {};
    let user2Responses = {};
    
    try {
      if (typeof localStorage !== 'undefined') {
        // In a real app, we would get the actual user IDs from the session
        // For demo, we'll just use mock responses
        const mockUser1 = 'demo-user-1';
        const mockUser2 = 'demo-user-2';
        
        const user1Data = localStorage.getItem(`responses_${code}_${mockUser1}`);
        const user2Data = localStorage.getItem(`responses_${code}_${mockUser2}`);
        
        if (user1Data) user1Responses = JSON.parse(user1Data);
        if (user2Data) user2Responses = JSON.parse(user2Data);
      }
    } catch (storageError) {
      console.warn('LocalStorage not available for reading matches:', storageError);
    }
    
    // Simulate matched movie IDs
    const movieMatches = [
      '238', // The Godfather
      '550', // Fight Club
      '155', // The Dark Knight
      '680', // Pulp Fiction
      '13', // Forrest Gump
    ];
    
    // Simulate matched food IDs
    const foodMatches = [
      '715769', // Pasta
      '716429', // Pizza
      '642539', // Burger
      '716276', // Sushi
      '716268', // Tacos
    ];
    
    console.log('Returning mock matches for demo purposes');
    return { movieMatches, foodMatches };
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

export { auth, db };
