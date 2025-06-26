# Match & Munch

A cross-platform mobile app that lets two users swipe right (yes) or left (no) on movie and food cards (like Tinder), then matches the items they both liked.

## 🚀 Live Demo

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/overview)

Try the live demo: [https://your-site-name.netlify.app](https://your-site-name.netlify.app)

## 🔧 Tech Stack

- **React Native (Expo)** - Mobile app framework
- **Firebase** - Authentication and Firestore database
- **TMDB API** - Movie data
- **Spoonacular API** - Food data
- **react-native-deck-swiper** - Card swipe interface
- **Netlify** - Web hosting and deployment

## 🌐 Web Deployment

This app is configured for deployment to Netlify. To deploy your own instance:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/match-and-munch.git
   cd match-and-munch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy to Netlify**
   - Push your code to a GitHub/GitLab/Bitbucket repository
   - Sign in to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Select your repository
   - Configure the build settings:
     - Build command: `npm run build:web`
     - Publish directory: `web-build`
   - Click "Deploy site"

4. **Set up environment variables**
   - In Netlify, go to Site settings > Build & deploy > Environment
   - Add the following environment variables:
     - `REACT_APP_FIREBASE_API_KEY`
     - `REACT_APP_FIREBASE_AUTH_DOMAIN`
     - `REACT_APP_FIREBASE_PROJECT_ID`
     - `REACT_APP_FIREBASE_STORAGE_BUCKET`
     - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
     - `REACT_APP_FIREBASE_APP_ID`
     - `REACT_APP_TMDB_API_KEY`
     - `REACT_APP_SPOONACULAR_API_KEY`

5. **Trigger a new deploy**
   - Any push to your repository will trigger a new deploy
   - You can also manually trigger a deploy from the Netlify dashboard

## 🧩 Features

### Authentication
- Anonymous sign-in using Firebase Auth

### Session Matching
- Create a session with a unique 6-character code
- Join a session using the code
- Store session data in Firestore

### Swipe Interface
- Swipe through movies (TMDB API)
- Swipe through food options (Spoonacular API)
- Store responses in Firestore

### Match Logic
- Compare "yes" responses from both users
- Find overlapping items in both categories
- Display all matched pairs

### Results Screen
- Card-style layout showing (movie, food) matches
- Share results with friends
- Start a new session

## 📱 App Flow

1. **Home Screen**: Create or join a session
2. **Swipe Screen**: Swipe through movies, then foods
3. **Results Screen**: View matched movie and food combinations

## 🚀 Getting Started

### Prerequisites

- Node.js
- Expo CLI
- Firebase account
- TMDB API key
- Spoonacular API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your environment variables in `.env`:
   ```
   TMDB_API_KEY=your_tmdb_key_here
   SPOONACULAR_API_KEY=your_spoonacular_key_here
   FIREBASE_API_KEY=your_firebase_key_here
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
   FIREBASE_APP_ID=your_firebase_app_id_here
   ```
4. Start the development server:
   ```
   npm start
   ```

## 🔥 Firebase Setup

1. Create a new Firebase project
2. Enable Anonymous Authentication
3. Create Firestore database with the following collections:
   - `/sessions`
   - `/sessions/{code}/responses/{userId}`

## 📝 Notes

- The app includes fallback food data in case the Spoonacular API is unavailable
- Both users must complete swiping before matches are calculated
- Only mutual "yes" votes are considered matches
