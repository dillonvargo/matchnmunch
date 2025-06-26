import axios from 'axios';
import { TMDB_API_KEY, TMDB_READ_ACCESS_TOKEN } from '@env';

// Create an axios instance with default headers
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// Add request interceptor to include API key in all requests
tmdbApi.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    api_key: TMDB_API_KEY,
    language: 'en-US'
  };
  return config;
});

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Get top-rated movies
export const getTopRatedMovies = async (pagesToFetch = 10) => {
  try {
    const pagePromises = [];
    for (let i = 1; i <= pagesToFetch; i++) {
      pagePromises.push(
        tmdbApi.get('/movie/top_rated', {
          params: { page: i, region: 'US' },
        })
      );
    }

    const responses = await Promise.all(pagePromises);
    const movies = responses.flatMap(response => response.data.results);

    const shuffledMovies = shuffleArray(movies);
    const selectedMovies = shuffledMovies.slice(0, 20);

    return selectedMovies.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average
    }));
  } catch (error) {
    console.error('Error fetching top-rated movies:', error);
    // Return fallback movie data if API call fails
    return getFallbackMovieData();
  }
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    
    const movie = response.data;
    
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      runtime: movie.runtime,
      genres: movie.genres.map(genre => genre.name)
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        with_genres: genreId,
        language: 'en-US',
        page: page,
      }
    });
    
    const shuffledMovies = shuffleArray(response.data.results);
    const selectedMovies = shuffledMovies.slice(0, 20);

    return selectedMovies.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average
    }));
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// Get movie genres
export const getMovieGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    // Return fallback genres if API call fails
    return [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
      { id: 10751, name: 'Family' },
      { id: 14, name: 'Fantasy' },
      { id: 27, name: 'Horror' },
      { id: 10749, name: 'Romance' },
      { id: 53, name: 'Thriller' }
    ];
  }
};

// Fallback movie data in case the API is not available
export const getFallbackMovieData = () => {
  const fallbackMovies = [
    {
      id: 2001,
      title: 'The Space Adventure',
      overview: 'A thrilling journey through the cosmos as astronauts discover a new form of life.',
      posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-05-15',
      voteAverage: 8.7
    },
    {
      id: 2002,
      title: 'Lost in Tokyo',
      overview: 'Two strangers meet in the bustling city of Tokyo and form an unexpected connection.',
      posterUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-04-10',
      voteAverage: 7.9
    },
    {
      id: 2003,
      title: 'The Last Detective',
      overview: 'A retiring detective takes on one final case that will challenge everything he knows.',
      posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-03-22',
      voteAverage: 8.2
    },
    {
      id: 2004,
      title: 'Summer of ʼ99',
      overview: 'A coming-of-age story about friendship, first love, and the summer that changed everything.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-06-30',
      voteAverage: 7.5
    },
    {
      id: 2005,
      title: 'Dark Forest',
      overview: 'A hiking trip turns into a nightmare when friends discover they\'re not alone in the woods.',
      posterUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-10-13',
      voteAverage: 6.8
    },
    {
      id: 2006,
      title: 'The Grand Heist',
      overview: 'A team of expert thieves plan the most daring art heist in history.',
      posterUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-08-05',
      voteAverage: 8.4
    },
    {
      id: 2007,
      title: 'Whispers in the Wind',
      overview: 'A writer moves to a small coastal town and discovers the locals harbor a supernatural secret.',
      posterUrl: 'https://images.unsplash.com/photo-1502085026218-530829ae22d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-02-14',
      voteAverage: 7.2
    },
    {
      id: 2008,
      title: 'Racing Hearts',
      overview: 'Two rival race car drivers find themselves falling for each other despite their fierce competition.',
      posterUrl: 'https://images.unsplash.com/photo-1588627541420-fce3f661b779?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-07-28',
      voteAverage: 7.7
    },
    {
      id: 2009,
      title: 'The Lost Prophecy',
      overview: 'An ancient prophecy leads a professor and his team on a global adventure to prevent catastrophe.',
      posterUrl: 'https://images.unsplash.com/photo-1524326578538-8d88aef6bc54?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-11-17',
      voteAverage: 8.1
    },
    {
      id: 2010,
      title: 'Digital Dreams',
      overview: 'A programmer creates an AI that begins to blur the line between virtual reality and the real world.',
      posterUrl: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-09-08',
      voteAverage: 8.9
    },
    {
      id: 2011,
      title: 'Midnight in Paris',
      overview: 'A novelist finds himself transported to 1920s Paris each night at midnight.',
      posterUrl: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-01-20',
      voteAverage: 7.8
    },
    {
      id: 2012,
      title: 'Skybound',
      overview: 'Passengers on a flight discover they cannot land as mysterious events unfold below.',
      posterUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      releaseDate: '2023-05-30',
      voteAverage: 6.9
    }
  ];
  const shuffledMovies = shuffleArray(fallbackMovies);
  return shuffledMovies.slice(0, 20);
};
