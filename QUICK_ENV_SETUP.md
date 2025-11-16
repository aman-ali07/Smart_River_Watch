# Quick .env Setup Guide

## 📋 All Environment Variables You Need

### ✅ REQUIRED (Firebase - 7 variables)

These are **required** for authentication and database to work:

1. `EXPO_PUBLIC_FIREBASE_API_KEY`
2. `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
3. `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
4. `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
5. `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
6. `EXPO_PUBLIC_FIREBASE_APP_ID`
7. `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional, for Analytics)

### ⚠️ OPTIONAL (3 variables)

8. `EXPO_PUBLIC_API_URL` - Backend API URL
9. `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID` - For Android maps
10. `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS` - For iOS maps

## 🚀 Quick Setup Steps

### Step 1: Get Firebase Config

1. Go to: https://console.firebase.google.com/
2. Create/Select project
3. Click ⚙️ (gear) > Project settings
4. Scroll to "Your apps" > Click Web app icon (</>)
5. Register app (give it a name)
6. Copy the config values

### Step 2: Add to .env

Open your `.env` file and add:

```env
# Firebase (Required)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy... (from Firebase)
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API (Optional - leave default if no backend)
EXPO_PUBLIC_API_URL=https://api.smartriverwatch.com

# Google Maps (Optional - leave empty if not using)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=
```

### Step 3: Enable Firebase Services

In Firebase Console:

1. **Authentication:**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

2. **Firestore:**
   - Go to Firestore Database
   - Click "Create database"
   - Start in "test mode"

3. **Storage:**
   - Go to Storage
   - Click "Get started"
   - Start in "test mode"

### Step 4: Restart Expo

```bash
npx expo start --clear
```

## ✅ Verify It Works

1. Check browser console - should NOT see "Firebase not configured"
2. Try to register/login - should work
3. No errors in console

## 📝 Important Notes

- ✅ All variables MUST start with `EXPO_PUBLIC_`
- ✅ No spaces around `=` sign
- ✅ No quotes around values
- ✅ One variable per line
- ✅ Restart Expo after changes

## 📚 More Help

See `ENV_SETUP_GUIDE.md` for detailed instructions.

