import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { StatusBar } from 'expo-status-bar';
import { auth, saveSwipeResponse, checkCategoryCompletion } from '../services/firebase';
import { getTopRatedMovies } from '../services/tmdb';
import { getRandomRecipes } from '../services/food';
import SwipeCard from '../components/SwipeCard';
import { colors, BackgroundPattern } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const SwipeScreen = ({ navigation, route }) => {
  const { sessionCode, isCreator } = route.params;
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('movies'); // 'movies' or 'foods'
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [partnerReady, setPartnerReady] = useState(false);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, [phase]);

  // Load appropriate data based on the current phase
  const loadData = async () => {
    setError(null); // Reset error state on new load attempt
    try {
      setLoading(true);
      
      if (phase === 'movies') {
        const movies = await getTopRatedMovies(); // Fetches multiple pages by default
        setItems(movies);
      } else {
        const foods = await getRandomRecipes(); // Fetches a larger, more varied list by default
        setItems(foods);
      }
      
      setCurrentIndex(0);
      setLoading(false);
    } catch (error) {
      console.error(`Error loading ${phase}:`, error);
      setError(`Failed to load ${phase}. Please try again.`);
      setLoading(false);
    }
  };

  // Handle swipe action
  const handleSwipe = async (direction, cardIndex) => {
    const item = items[cardIndex];
    const isLike = direction === 'right';
    
    try {
      // Save the response to Firebase
      await saveSwipeResponse(
        sessionCode,
        auth.currentUser.uid,
        item.id,
        isLike,
        phase // 'movies' or 'foods'
      );
      
      // If this is the last card, check if we should move to the next phase
      if (cardIndex === items.length - 1) {
        handlePhaseCompletion();
      }
    } catch (error) {
      console.error('Error saving response:', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
    }
  };

  // Handle phase completion
  const handlePhaseCompletion = async () => {
    try {
      setIsWaiting(true);
      
      // Check if both users have completed this phase
      const bothCompleted = await checkCategoryCompletion(
        sessionCode,
        phase,
        items.length
      );
      
      if (bothCompleted) {
        // If we just completed the movies phase, move to foods
        if (phase === 'movies') {
          setPhase('foods');
          setIsWaiting(false);
        } 
        // If we just completed the foods phase, go to results
        else {
          navigation.replace('Result', { sessionCode });
        }
      } else {
        // Wait for partner to finish
        setPartnerReady(false);
        startPolling();
      }
    } catch (error) {
      console.error('Error checking phase completion:', error);
      setIsWaiting(false);
      Alert.alert('Error', 'Failed to check phase completion. Please try again.');
    }
  };

  // Poll for partner completion
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const bothCompleted = await checkCategoryCompletion(
          sessionCode,
          phase,
          items.length
        );
        
        if (bothCompleted) {
          clearInterval(interval);
          setPartnerReady(true);
          
          // If we just completed the movies phase, move to foods
          if (phase === 'movies') {
            setPhase('foods');
            setIsWaiting(false);
          } 
          // If we just completed the foods phase, go to results
          else {
            navigation.replace('Result', { sessionCode });
          }
        }
      } catch (error) {
        console.error('Error polling for completion:', error);
      }
    }, 3000); // Check every 3 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  };

  // Render waiting screen
  const renderWaitingScreen = () => (
    <View style={styles.waitingContainer}>
      <ActivityIndicator size="large" color={colors.primaryButton} />
      <Text style={styles.waitingText}>
        Waiting for your partner to finish swiping...
      </Text>
      <Text style={styles.sessionCodeText}>
        Session Code: {sessionCode}
      </Text>
    </View>
  );

  // Render partner ready screen
  const renderPartnerReadyScreen = () => (
    <View style={styles.waitingContainer}>
      <Text style={styles.readyText}>
        Your partner has finished swiping!
      </Text>
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => {
          if (phase === 'movies') {
            setPhase('foods');
            setIsWaiting(false);
          } else {
            navigation.replace('Result', { sessionCode });
          }
        }}
      >
        <Text style={styles.continueButtonText}>
          {phase === 'movies' ? 'Continue to Foods' : 'View Results'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render error screen
  const renderErrorScreen = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => loadData()}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <BackgroundPattern />
      <StatusBar style="dark" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryButton} />
          <Text style={styles.loadingText}>Loading {phase}...</Text>
        </View>
      ) : error ? (
        renderErrorScreen()
      ) : isWaiting ? (
        partnerReady ? renderPartnerReadyScreen() : renderWaitingScreen()
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.phaseText}>
              {phase === 'movies' ? 'Phase 1: Movies' : 'Phase 2: Foods'}
            </Text>
            <Text style={styles.sessionText}>Session: {sessionCode}</Text>
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Swipe right for 'LIKE', left for 'NOPE'
            </Text>
          </View>

          <View style={styles.swiperContainer}>
            <Swiper
              ref={swiperRef}
              cards={items}
              renderCard={(card) => <SwipeCard item={card} type={phase === 'movies' ? 'movie' : 'food'} />}
              onSwiped={(cardIndex) => setCurrentIndex(cardIndex + 1)}
              onSwipedLeft={(cardIndex) => handleSwipe('left', cardIndex)}
              onSwipedRight={(cardIndex) => handleSwipe('right', cardIndex)}
              onSwipedAll={handlePhaseCompletion}
              cardIndex={0}
              backgroundColor="transparent"
              stackSize={3}
              stackSeparation={15}
              animateOverlayLabelsOpacity
              animateCardOpacity
              disableTopSwipe
              disableBottomSwipe
              overlayLabels={{
                left: {
                  title: 'NOPE',
                  style: {
                    label: {
                      backgroundColor: colors.nopeButton,
                      color: 'white',
                      fontSize: 24,
                      borderRadius: 10,
                      padding: 10,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: -30,
                    }
                  }
                },
                right: {
                  title: 'LIKE',
                  style: {
                    label: {
                      backgroundColor: colors.likeButton,
                      color: 'white',
                      fontSize: 24,
                      borderRadius: 10,
                      padding: 10,
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: 30,
                    }
                  }
                }
              }}
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.nopeButton]} 
              onPress={() => swiperRef.current.swipeLeft()}
            >
              <Text style={styles.buttonText}>NOPE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.likeButton]} 
              onPress={() => swiperRef.current.swipeRight()}
            >
              <Text style={styles.buttonText}>LIKE</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  sessionText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  instructionContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  instructionText: {
    fontSize: 16,
    color: colors.secondaryText,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.secondaryText,
  },
  swiperContainer: {
    flex: 1,
    paddingTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  button: {
    width: 120,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  nopeButton: {
    backgroundColor: colors.nopeButton,
  },
  likeButton: {
    backgroundColor: colors.likeButton,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  waitingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: colors.primaryText,
  },
  sessionCodeText: {
    fontSize: 16,
    color: colors.secondaryText,
    marginTop: 10,
  },
  readyText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.primaryText,
  },
  continueButton: {
    backgroundColor: colors.primaryButton,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  continueButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SwipeScreen;
