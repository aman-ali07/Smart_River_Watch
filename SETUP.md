# Smart River Watch - Project Setup

## ✅ Completed Setup

### Dependencies Installed

- ✅ **React Navigation**
  - `@react-navigation/native` - Core navigation library
  - `@react-navigation/stack` - Stack navigator
  - `@react-navigation/bottom-tabs` - Bottom tab navigator

- ✅ **NativeWind (Tailwind CSS)**
  - `nativewind` - Tailwind CSS for React Native
  - `tailwindcss` - Tailwind CSS core

- ✅ **Expo Packages**
  - `expo-linear-gradient` - Linear gradient components
  - `expo-blur` - Blur effects
  - `expo-notifications` - Push notifications

- ✅ **Maps & Charts**
  - `react-native-maps` - Map components
  - `react-native-chart-kit` - Chart components

- ✅ **Firebase SDK**
  - `firebase` - Firebase services (Auth, Firestore, Storage, Analytics)

- ✅ **State Management**
  - `zustand` - Global state management
  - `@react-native-async-storage/async-storage` - Persistent storage

### Folder Structure

```
smart_river_watch/
├── app/                    # Expo Router app directory (legacy)
├── screens/                # Screen components
│   ├── HomeScreen.tsx
│   ├── MonitorScreen.tsx
│   ├── MapScreen.tsx
│   ├── ReportsScreen.tsx
│   └── ProfileScreen.tsx
├── components/             # Reusable components
├── hooks/                  # Custom React hooks
├── services/               # Service layer
│   ├── api.ts             # API service
│   ├── firebase.ts        # Firebase configuration
│   ├── notifications.ts  # Notification service
│   └── store.ts           # Zustand store
├── theme/                  # Theme configuration
│   └── index.ts           # Base theme file
├── constants/              # App constants
│   └── index.ts           # Constants definitions
├── navigation/             # Navigation setup
│   ├── types.ts           # TypeScript types
│   ├── AppNavigator.tsx   # Root stack navigator
│   └── TabNavigator.tsx   # Bottom tab navigator
├── assets/                 # Static assets
│   ├── images/
│   └── fonts/
├── App.tsx                 # Main app entry point
├── index.js               # Expo entry point
├── babel.config.js        # Babel config (NativeWind)
├── tailwind.config.js     # Tailwind config
├── metro.config.js        # Metro bundler config
├── tsconfig.json          # TypeScript config
└── global.css             # Global styles (NativeWind)
```

### Configuration Files

#### TypeScript Paths (`tsconfig.json`)
- `@/*` - Root directory
- `@/screens/*` - Screens directory
- `@/components/*` - Components directory
- `@/hooks/*` - Hooks directory
- `@/services/*` - Services directory
- `@/theme/*` - Theme directory
- `@/constants/*` - Constants directory
- `@/navigation/*` - Navigation directory
- `@/assets/*` - Assets directory

#### NativeWind Configuration
- `babel.config.js` - Babel preset for NativeWind
- `tailwind.config.js` - Tailwind configuration
- `metro.config.js` - Metro bundler with NativeWind
- `global.css` - Global CSS file imported in App.tsx
- `nativewind-env.d.ts` - TypeScript definitions

#### Navigation Structure
- **Stack Navigator** (`AppNavigator.tsx`) - Root navigator
  - MainTabs (Tab Navigator)
  - Modal screen
- **Tab Navigator** (`TabNavigator.tsx`) - Bottom tabs
  - Home
  - Monitor
  - Map
  - Reports
  - Profile

### Theme System

The base theme file (`theme/index.ts`) includes:
- **Colors**: Primary, secondary, accent, semantic, neutral, background, text, border
- **Spacing**: Consistent spacing scale (0-24)
- **Typography**: Font families, sizes, weights, line heights
- **Border Radius**: Consistent border radius values
- **Shadows**: Predefined shadow styles for iOS and Android

### State Management (Zustand)

The store (`services/store.ts`) includes:
- User authentication state
- Water quality data
- Alerts management
- Theme preferences
- Loading states
- Persistent storage with AsyncStorage

### Services

1. **Firebase** (`services/firebase.ts`)
   - Authentication
   - Firestore database
   - Storage
   - Analytics (web only)
   - ⚠️ **TODO**: Add your Firebase config in environment variables

2. **Notifications** (`services/notifications.ts`)
   - Permission handling
   - Local notifications
   - Push notifications (Expo Push Token)
   - Notification channels (Android)

3. **API Service** (`services/api.ts`)
   - HTTP client
   - GET, POST, PUT, DELETE methods
   - Error handling
   - ⚠️ **TODO**: Update `API_CONFIG.BASE_URL` in constants

### Constants

App constants (`constants/index.ts`) include:
- API configuration
- App configuration
- Water quality parameters
- Alert types
- Issue report types
- Map configuration
- Notification channels

## 🚀 Next Steps

1. **Firebase Setup**
   - Create a Firebase project
   - Add your Firebase config to `.env` file:
     ```
     EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
     EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
     ```

2. **API Configuration**
   - Update `API_CONFIG.BASE_URL` in `constants/index.ts` with your backend URL

3. **Maps Configuration**
   - For iOS: Add Google Maps API key in `app.json` (ios.config.googleMapsApiKey)
   - For Android: Add Google Maps API key in `app.json` (android.config.googleMapsApiKey)

4. **Start Development**
   ```bash
   npm start
   ```

## 📝 Notes

- The project uses **React Navigation** (not Expo Router) for navigation
- **NativeWind** is configured for Tailwind CSS styling
- All screens are placeholder components ready for implementation
- TypeScript is fully configured with path aliases
- The app requests notification permissions on startup

## 🔧 Troubleshooting

### NativeWind not working?
- Make sure `global.css` is imported in `App.tsx`
- Clear Metro cache: `npx expo start -c`

### Maps not showing?
- Add Google Maps API keys in `app.json`
- For iOS, you may need to configure Info.plist

### Firebase errors?
- Check that all environment variables are set
- Verify Firebase project configuration

