# Web Platform Fix

## Problem
Error: `(0 , _reactNativeWebDistIndex.codegenNativeComponent) is not a function`

This error occurs because native modules like `expo-blur` and `react-native-maps` don't have web implementations.

## Solution

### 1. Web Fallbacks Created
- `components/ui/BlurView.web.tsx` - Web fallback for BlurView
- `components/ui/MapView.web.tsx` - Web fallback for MapView

React Native Web automatically resolves `.web.tsx` files when running on web.

### 2. Platform-Specific Imports
Updated `App.tsx` to conditionally import notification services only on native platforms.

### 3. Webpack Configuration
Created `webpack.config.js` to handle web-specific module resolution.

## How It Works

React Native Web uses platform-specific file extensions:
- `.web.tsx` - Used on web
- `.native.tsx` - Used on iOS/Android
- `.tsx` - Default fallback

When you import:
```typescript
import { BlurView } from 'expo-blur';
```

On web, it will automatically use `components/ui/BlurView.web.tsx` if the module doesn't have web support.

## Testing

1. **Web**: `npm run web` or `expo start --web`
2. **Native**: `npm run android` or `npm run ios`

## Notes

- Maps will show a placeholder on web (maps require native implementation)
- BlurView will use a semi-transparent background on web (true blur requires native)
- Notifications are disabled on web (not supported)

## If Issues Persist

1. Clear cache: `expo start -c`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear Metro bundler cache: `npx expo start --clear`

