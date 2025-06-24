import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const MatchResults = ({ movieMatches, foodMatches, onPairSelect }) => {
  // If no matches, show a message
  if ((!movieMatches || movieMatches.length === 0) && 
      (!foodMatches || foodMatches.length === 0)) {
    return (
      <View style={styles.noMatchesContainer}>
        <Text style={styles.noMatchesText}>No matches found!</Text>
        <Text style={styles.noMatchesSubtext}>Try again with different preferences.</Text>
      </View>
    );
  }

  // If we have matches in both categories, show the combinations
  if (movieMatches?.length > 0 && foodMatches?.length > 0) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Your Perfect Match & Munch Combos!</Text>
        
        {/* Top match highlighted */}
        <View style={styles.topMatchContainer}>
          <Text style={styles.topMatchLabel}>TOP MATCH</Text>
          <View style={styles.topMatchContent}>
            <Image 
              source={{ uri: movieMatches[0].posterUrl }} 
              style={styles.topMatchImage} 
              resizeMode="cover"
            />
            <View style={styles.plusContainer}>
              <Text style={styles.plusText}>+</Text>
            </View>
            <Image 
              source={{ uri: foodMatches[0].imageUrl }} 
              style={styles.topMatchImage} 
              resizeMode="cover"
            />
          </View>
          <Text style={styles.topMatchTitle}>
            {movieMatches[0].title} + {foodMatches[0].title}
          </Text>
        </View>
        
        {/* Other combinations */}
        <Text style={styles.otherMatchesTitle}>Other Great Combinations</Text>
        <View style={styles.pairsContainer}>
          {movieMatches.slice(0, 3).map(movie => (
            foodMatches.slice(0, 3).map(food => (
              // Skip the top match which is already displayed
              (movie.id === movieMatches[0].id && food.id === foodMatches[0].id) ? null : (
                <TouchableOpacity 
                  key={`${movie.id}-${food.id}`}
                  style={styles.pairCard}
                  onPress={() => onPairSelect(movie, food)}
                >
                  <View style={styles.pairImagesContainer}>
                    <Image 
                      source={{ uri: movie.posterUrl }} 
                      style={styles.pairImage} 
                      resizeMode="cover"
                    />
                    <Image 
                      source={{ uri: food.imageUrl }} 
                      style={styles.pairImage} 
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.pairTitle} numberOfLines={1}>
                    {movie.title}
                  </Text>
                  <Text style={styles.pairTitle} numberOfLines={1}>
                    {food.title}
                  </Text>
                </TouchableOpacity>
              )
            ))
          ))}
        </View>
        
        {/* All movies section */}
        <Text style={styles.sectionTitle}>All Matched Movies</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {movieMatches.map(movie => (
            <View key={movie.id} style={styles.itemCard}>
              <Image 
                source={{ uri: movie.posterUrl }} 
                style={styles.itemImage} 
                resizeMode="cover"
              />
              <Text style={styles.itemTitle} numberOfLines={2}>{movie.title}</Text>
            </View>
          ))}
        </ScrollView>
        
        {/* All foods section */}
        <Text style={styles.sectionTitle}>All Matched Foods</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {foodMatches.map(food => (
            <View key={food.id} style={styles.itemCard}>
              <Image 
                source={{ uri: food.imageUrl }} 
                style={styles.itemImage} 
                resizeMode="cover"
              />
              <Text style={styles.itemTitle} numberOfLines={2}>{food.title}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    );
  }
  
  // If we only have matches in one category
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>
        {movieMatches?.length > 0 ? 'Your Movie Matches' : 'Your Food Matches'}
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
        {(movieMatches || foodMatches).map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image 
              source={{ uri: movieMatches ? item.posterUrl : item.imageUrl }} 
              style={styles.itemImage} 
              resizeMode="cover"
            />
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.partialMatchContainer}>
        <Text style={styles.partialMatchText}>
          You only matched on {movieMatches?.length > 0 ? 'movies' : 'foods'}!
        </Text>
        <Text style={styles.partialMatchSubtext}>
          Try again to find a perfect Match & Munch combo.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMatchesText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noMatchesSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  topMatchContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topMatchLabel: {
    backgroundColor: '#ff6b6b',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  topMatchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  topMatchImage: {
    width: width * 0.3,
    height: width * 0.45,
    borderRadius: 10,
  },
  plusContainer: {
    marginHorizontal: 10,
  },
  plusText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  topMatchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
  },
  otherMatchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pairsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pairCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pairImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
  },
  pairImage: {
    width: '45%',
    height: 100,
    borderRadius: 5,
  },
  pairTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  horizontalList: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemCard: {
    width: width * 0.35,
    marginRight: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: width * 0.35,
    height: width * 0.5,
    borderRadius: 10,
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  partialMatchContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  partialMatchText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  partialMatchSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default MatchResults;
