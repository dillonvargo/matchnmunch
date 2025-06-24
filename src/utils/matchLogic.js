// Find matches between two users' responses
export const findMatches = (user1Responses, user2Responses) => {
  const matches = {
    movies: [],
    foods: []
  };
  
  // Find movie matches
  if (user1Responses.movies?.yes && user2Responses.movies?.yes) {
    matches.movies = user1Responses.movies.yes.filter(id => 
      user2Responses.movies.yes.includes(id)
    );
  }
  
  // Find food matches
  if (user1Responses.foods?.yes && user2Responses.foods?.yes) {
    matches.foods = user1Responses.foods.yes.filter(id => 
      user2Responses.foods.yes.includes(id)
    );
  }
  
  return matches;
};

// Generate all possible movie-food combinations
export const generateCombinations = (movieMatches, foodMatches) => {
  const combinations = [];
  
  for (const movieId of movieMatches) {
    for (const foodId of foodMatches) {
      combinations.push({
        movieId,
        foodId
      });
    }
  }
  
  return combinations;
};

// Check if both users have completed swiping
export const checkSessionCompletion = (user1Responses, user2Responses, totalMovies, totalFoods) => {
  // Check if both users have completed swiping on movies
  const moviesComplete = 
    (user1Responses.movies?.yes?.length + user1Responses.movies?.no?.length >= totalMovies) &&
    (user2Responses.movies?.yes?.length + user2Responses.movies?.no?.length >= totalMovies);
  
  // Check if both users have completed swiping on foods
  const foodsComplete = 
    (user1Responses.foods?.yes?.length + user1Responses.foods?.no?.length >= totalFoods) &&
    (user2Responses.foods?.yes?.length + user2Responses.foods?.no?.length >= totalFoods);
  
  return {
    moviesComplete,
    foodsComplete,
    allComplete: moviesComplete && foodsComplete
  };
};
