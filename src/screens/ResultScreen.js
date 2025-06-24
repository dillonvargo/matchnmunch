import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getMatches } from '../services/firebase';
import { getMovieDetails } from '../services/tmdb';
import { getRecipeDetails } from '../services/food';
import MatchResults from '../components/MatchResults';

const ResultScreen = ({ navigation, route }) => {
  const { sessionCode } = route.params;
  const [loading, setLoading] = useState(true);
  const [movieMatches, setMovieMatches] = useState([]);
  const [foodMatches, setFoodMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  // Fetch matches from Firebase
  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // Get the match IDs from Firebase
      const matches = await getMatches(sessionCode);
      
      if (matches.movies.length === 0 && matches.foods.length === 0) {
        setLoading(false);
        return;
      }
      
      // Fetch details for each matched movie
      const moviePromises = matches.movies.map(movieId => getMovieDetails(movieId));
      const movieDetails = await Promise.all(moviePromises);
      setMovieMatches(movieDetails);
      
      // Fetch details for each matched food
      const foodPromises = matches.foods.map(foodId => getRecipeDetails(foodId));
      const foodDetails = await Promise.all(foodPromises);
      setFoodMatches(foodDetails);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load matches. Please try again.');
      setLoading(false);
    }
  };

  // Share results with friends
  const handleShare = async () => {
    try {
      const movieTitle = movieMatches.length > 0 ? movieMatches[0].title : 'No movie';
      const foodTitle = foodMatches.length > 0 ? foodMatches[0].title : 'No food';
      
      await Share.share({
        message: `We matched on Match & Munch! Our perfect combo is ${movieTitle} with ${foodTitle}. Download the app to find your own perfect movie and food combo!`,
        title: 'Match & Munch Results'
      });
    } catch (error) {
      console.error('Error sharing results:', error);
      Alert.alert('Error', 'Failed to share results.');
    }
  };

  // Handle selecting a specific movie-food pair
  const handlePairSelect = (movie, food) => {
    Alert.alert(
      'Perfect Match!',
      `You both liked:\n\n🎬 ${movie.title}\n🍽️ ${food.title}\n\nEnjoy your movie night!`,
      [{ text: 'Nice!', style: 'default' }]
    );
  };

  // Start a new session
  const handleNewSession = () => {
    navigation.popToTop();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Finding your matches...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchMatches}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <MatchResults 
        movieMatches={movieMatches}
        foodMatches={foodMatches}
        onPairSelect={handlePairSelect}
      />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Text style={styles.buttonText}>Share Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.newSessionButton}
          onPress={handleNewSession}
        >
          <Text style={styles.buttonText}>New Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shareButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  newSessionButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
