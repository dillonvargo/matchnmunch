import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SwipeCard = ({ item, type }) => {
  // Determine if we're displaying a movie or food
  const isMovie = type === 'movie';
  
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: isMovie ? item.posterUrl : item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        
        {isMovie ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.releaseDate}>
              {item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'N/A'}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.voteAverage?.toFixed(1) || 'N/A'}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.detailsContainer}>
            <Text style={styles.cookTime}>
              ⏱️ {item.readyInMinutes} min
            </Text>
            <Text style={styles.servings}>
              👥 Serves {item.servings}
            </Text>
          </View>
        )}
        
        <Text style={styles.description} numberOfLines={3}>
          {isMovie ? item.overview : item.summary}
        </Text>
      </View>
      
      <View style={styles.overlayContainer}>
        <View style={[styles.overlay, styles.likeOverlay]}>
          <Text style={styles.overlayText}>LIKE</Text>
        </View>
        <View style={[styles.overlay, styles.nopeOverlay]}>
          <Text style={styles.overlayText}>NOPE</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 15,
    height: '30%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#666',
  },
  cookTime: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  servings: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    opacity: 0, // Hidden by default
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeOverlay: {
    backgroundColor: 'rgba(0, 200, 0, 0.4)',
    transform: [{ rotate: '-30deg' }],
  },
  nopeOverlay: {
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    transform: [{ rotate: '30deg' }],
  },
  overlayText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: 'white',
    borderWidth: 5,
    borderColor: 'white',
    padding: 10,
  },
});

export default SwipeCard;
