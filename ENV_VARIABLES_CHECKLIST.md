# Environment Variables Checklist

## ✅ Required Variables (Must Have)

### Firebase Configuration (7 variables)
These are **REQUIRED** for the app to work properly with authentication and database.

1. ✅ `EXPO_PUBLIC_FIREBASE_API_KEY`
   - **Where to get:** Firebase Console > Project Settings > General > Your apps > Web app
   - **Format:** `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
   - **Example:** `EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEf1234567890`

2. ✅ `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - **Where to get:** Same as above
   - **Format:** `your-project-id.firebaseapp.com`
   - **Example:** `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject.firebaseapp.com`

3. ✅ `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - **Where to get:** Same as above
   - **Format:** Your project ID (lowercase, no spaces)
   - **Example:** `EXPO_PUBLIC_FIREBASE_PROJECT_ID=myproject`

4. ✅ `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - **Where to get:** Same as above
   - **Format:** `your-project-id.appspot.com`
   - **Example:** `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject.appspot.com`

5. ✅ `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - **Where to get:** Same as above
   - **Format:** Numbers only
   - **Example:** `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012`

6. ✅ `EXPO_PUBLIC_FIREBASE_APP_ID`
   - **Where to get:** Same as above
   - **Format:** `1:numbers:web:letters`
   - **Example:** `EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456`

7. ⚠️ `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID` (Optional but recommended)
   - **Where to get:** Firebase Console > Project Settings > General > Your apps > Web app
   - **Format:** `G-XXXXXXXXXX`
   - **Example:** `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234`
   - **Note:** Only needed for Analytics on web

## 📋 Optional Variables

### API Configuration
8. ⚠️ `EXPO_PUBLIC_API_URL` (Optional)
   - **Default:** `https://api.smartriverwatch.com`
   - **When needed:** If you have a backend API
   - **Example:** `EXPO_PUBLIC_API_URL=https://api.example.com`

### Google Maps
9. ⚠️ `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID` (Optional)
   - **When needed:** For real maps on Android
   - **Get from:** Google Cloud Console > APIs & Services > Credentials

10. ⚠️ `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS` (Optional)
    - **When needed:** For real maps on iOS
    - **Get from:** Google Cloud Console > APIs & Services > Credentials

## 📝 Quick Copy Template

Copy this to your `.env` file and replace the values:

```env
# Firebase (Required)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

# API (Optional)
EXPO_PUBLIC_API_URL=https://api.smartriverwatch.com

# Google Maps (Optional)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=
```

## 🔍 How to Verify Your .env File

1. **Check format:**
   - ✅ No spaces around `=`
   - ✅ No quotes around values
   - ✅ All keys start with `EXPO_PUBLIC_`
   - ✅ One variable per line

2. **Check values:**
   - ✅ No placeholder text like "your-api-key-here"
   - ✅ All Firebase values are filled
   - ✅ Values match what's in Firebase Console

3. **Test:**
   ```bash
   # Restart Expo
   npx expo start --clear
   
   # Check browser console - should NOT see "Firebase not configured" warning
   ```

## 🚨 Common Mistakes to Avoid

❌ **Wrong:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY = "AIzaSy..."  # Spaces and quotes
EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSy..."    # Quotes
FIREBASE_API_KEY=AIzaSy...                  # Missing EXPO_PUBLIC_
```

✅ **Correct:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
```

## 📚 Step-by-Step: Getting Firebase Config

1. Go to https://console.firebase.google.com/
2. Sign in with Google account
3. Click "Add project" or select existing
4. Click gear icon (⚙️) > "Project settings"
5. Scroll to "Your apps" section
6. Click Web app icon (</>) or "Add app" > Web
7. Register app (give it a name)
8. Copy the config object that appears
9. Copy each value to your .env file

## ✅ After Setup

1. Save `.env` file
2. Restart Expo: `npx expo start --clear`
3. Check browser console - should see no Firebase warnings
4. Try logging in - should work if Firebase is configured correctly

