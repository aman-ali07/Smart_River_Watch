# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your Firebase values** (see instructions below)

3. **Restart Expo server:**
   ```bash
   npx expo start --clear
   ```

## Required Variables

### 🔥 Firebase Configuration (REQUIRED)

These are **required** for authentication and database features to work.

#### How to Get Firebase Config:

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create or Select Project:**
   - Click "Add project" or select existing project
   - Follow the setup wizard

3. **Get Web App Config:**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Scroll down to "Your apps" section
   - Click on the Web app icon (</>) or "Add app" > Web
   - If you don't have a web app, create one:
     - Register app with a nickname (e.g., "Smart River Watch Web")
     - Copy the config values

4. **Copy These Values:**
   ```javascript
   // You'll see something like this:
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

5. **Add to .env:**
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

6. **Enable Firebase Services:**
   - **Authentication:** Go to Authentication > Sign-in method > Enable Email/Password
   - **Firestore:** Go to Firestore Database > Create database > Start in test mode
   - **Storage:** Go to Storage > Get started > Start in test mode

7. **Get Measurement ID (Optional - for Analytics):**
   - In Project Settings > General > Your apps > Web app
   - Look for "Measurement ID" (format: G-XXXXXXXXXX)
   - Add to .env: `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX`

### 🌐 API Configuration (OPTIONAL)

Only needed if you have a backend API.

```env
EXPO_PUBLIC_API_URL=https://api.smartriverwatch.com
```

### 🗺️ Google Maps API Key (OPTIONAL)

Only needed if you want to use real maps (currently using placeholder on web).

#### How to Get Google Maps API Key:

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Create a project or select existing

2. **Enable Maps APIs:**
   - Go to "APIs & Services" > "Library"
   - Search and enable:
     - "Maps SDK for Android"
     - "Maps SDK for iOS"
     - "Maps JavaScript API" (for web)

3. **Create API Key:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the key

4. **Add Restrictions (Recommended):**
   - Click on the API key to edit
   - Under "Application restrictions":
     - For Android: Add package name: `com.smartriverwatch.app`
     - For iOS: Add bundle ID: `com.smartriverwatch.app`
   - Under "API restrictions": Restrict to Maps APIs only

5. **Add to .env:**
   ```env
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=your-android-key
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=your-ios-key
   ```

## Example .env File

```env
# Firebase (Required)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=myproject
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API (Optional)
EXPO_PUBLIC_API_URL=https://api.smartriverwatch.com

# Google Maps (Optional)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=AIzaSy...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=AIzaSy...
```

## Important Notes

1. **All variables MUST start with `EXPO_PUBLIC_`** - This is required by Expo to expose them to your app

2. **No spaces around `=`** - Use `KEY=value` not `KEY = value`

3. **No quotes needed** - Just the value directly: `KEY=value` not `KEY="value"`

4. **Restart after changes** - Always run `npx expo start --clear` after updating .env

5. **Never commit .env** - The .env file is in .gitignore and should never be committed to git

6. **Firebase is required** - Without Firebase config, authentication and database features won't work

## Troubleshooting

### "Firebase not configured" warning
- Check that all Firebase variables are set in .env
- Make sure variables start with `EXPO_PUBLIC_`
- Restart Expo server with `--clear` flag

### "Invalid API key" error
- Verify you copied the correct key from Firebase Console
- Check for extra spaces or quotes
- Make sure Firebase services are enabled (Auth, Firestore, Storage)

### Variables not loading
- Restart Expo: `npx expo start --clear`
- Check variable names match exactly (case-sensitive)
- Verify .env file is in the project root directory

## Next Steps

After setting up .env:

1. **Test Firebase connection:**
   - Try logging in/registering
   - Check browser console for Firebase errors

2. **Test API (if configured):**
   - Check if API calls work
   - Verify BASE_URL is correct

3. **Test Maps (if configured):**
   - Check if maps load on mobile devices
   - Verify API key restrictions allow your app

