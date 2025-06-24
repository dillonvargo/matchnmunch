import axios from 'axios';
import { SPOONACULAR_API_KEY } from '@env';

const BASE_URL = 'https://api.spoonacular.com';
const IMAGE_BASE_URL = 'https://spoonacular.com/recipeImages/';

// Get random recipes
export const getRandomRecipes = async (number = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/random`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        number: number
      }
    });
    
    return response.data.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary,
      imageUrl: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      healthScore: recipe.healthScore
    }));
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    
    // Fallback to static data if API fails
    return getFallbackFoodData();
  }
};

// Get recipes by cuisine
export const getRecipesByCuisine = async (cuisine, number = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        cuisine: cuisine,
        number: number,
        addRecipeInformation: true
      }
    });
    
    return response.data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary,
      imageUrl: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings
    }));
  } catch (error) {
    console.error('Error fetching recipes by cuisine:', error);
    
    // Fallback to static data if API fails
    return getFallbackFoodData();
  }
};

// Get recipe details
export const getRecipeDetails = async (recipeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${recipeId}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY
      }
    });
    
    const recipe = response.data;
    
    return {
      id: recipe.id,
      title: recipe.title,
      summary: recipe.summary,
      imageUrl: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      healthScore: recipe.healthScore,
      instructions: recipe.instructions,
      ingredients: recipe.extendedIngredients.map(ingredient => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit
      }))
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    
    // Return a fallback item if API fails
    const fallbackData = getFallbackFoodData();
    return fallbackData.find(item => item.id === recipeId) || fallbackData[0];
  }
};

// Fallback food data in case the API is not available
export const getFallbackFoodData = () => {
  return [
    {
      id: 1001,
      title: 'Margherita Pizza',
      summary: 'Classic Italian pizza with tomato sauce, mozzarella, and basil.',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 30,
      servings: 2,
      healthScore: 65
    },
    {
      id: 1002,
      title: 'Spaghetti Carbonara',
      summary: 'Traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 25,
      servings: 4,
      healthScore: 55
    },
    {
      id: 1003,
      title: 'Chicken Tikka Masala',
      summary: 'Roasted marinated chicken chunks in spiced curry sauce.',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 45,
      servings: 4,
      healthScore: 70
    },
    {
      id: 1004,
      title: 'Beef Burger',
      summary: 'Juicy beef patty with lettuce, tomato, and special sauce on a brioche bun.',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 20,
      servings: 2,
      healthScore: 45
    },
    {
      id: 1005,
      title: 'Caesar Salad',
      summary: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese.',
      imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 15,
      servings: 2,
      healthScore: 80
    },
    {
      id: 1006,
      title: 'Chocolate Brownie',
      summary: 'Rich, fudgy chocolate brownie with walnuts.',
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 40,
      servings: 9,
      healthScore: 30
    },
    {
      id: 1007,
      title: 'Vegetable Stir Fry',
      summary: 'Quick and healthy stir-fried vegetables with soy sauce and ginger.',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 20,
      servings: 2,
      healthScore: 90
    },
    {
      id: 1008,
      title: 'Fish Tacos',
      summary: 'Grilled fish with cabbage slaw and lime crema in corn tortillas.',
      imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 25,
      servings: 4,
      healthScore: 75
    },
    {
      id: 1009,
      title: 'Mushroom Risotto',
      summary: 'Creamy Italian rice dish with mushrooms, white wine, and parmesan.',
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 35,
      servings: 4,
      healthScore: 65
    },
    {
      id: 1010,
      title: 'Greek Salad',
      summary: 'Fresh salad with tomatoes, cucumbers, olives, and feta cheese.',
      imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      readyInMinutes: 15,
      servings: 2,
      healthScore: 85
    }
  ];
};
