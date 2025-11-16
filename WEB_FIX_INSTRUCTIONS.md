# Web Platform Error Fix

## Error
```
(0 , _reactNativeWebDistIndex.codegenNativeComponent) is not a function
```

## Root Cause
Native modules like `expo-blur` and `react-native-maps` don't have web implementations and cause this error when running on web.

## Solution Applied

### 1. Created Web Fallbacks
- ✅ `components/ui/BlurView.web.tsx` - Web-compatible BlurView
- ✅ `components/ui/MapView.web.tsx` - Web-compatible MapView placeholder

### 2. Updated App.tsx
- ✅ Conditionally imports notification services (native only)
- ✅ Prevents web from trying to load native notification modules

### 3. Created Webpack Config
- ✅ `webpack.config.js` - Aliases native modules to web fallbacks

## Quick Fix Steps

1. **Clear cache and restart:**
   ```bash
   # Stop the current server (Ctrl+C)
   npx expo start --clear --web
   ```

2. **If that doesn't work, try:**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   npx expo start --clear --web
   ```

3. **If webpack config isn't working:**
   - The webpack config should automatically alias `expo-blur` and `react-native-maps` to web fallbacks
   - If issues persist, you may need to install `@expo/webpack-config`:
     ```bash
     npm install --save-dev @expo/webpack-config
     ```

## Alternative: Use Metro Bundler (Recommended)

If webpack causes issues, Expo's Metro bundler with platform-specific files should work automatically:

1. **Ensure `.web.tsx` files are in place** (already done)
2. **Use Metro for web:**
   ```bash
   npx expo start --web
   ```

Metro should automatically resolve `.web.tsx` files when running on web.

## Testing

After applying fixes:
```bash
npx expo start --web
```

The app should load without the `codegenNativeComponent` error.

## What to Expect on Web

- ✅ **BlurView**: Will show semi-transparent backgrounds (not true blur)
- ✅ **MapView**: Will show a placeholder message (maps need native implementation)
- ✅ **Notifications**: Disabled on web (not supported)
- ✅ **All other features**: Should work normally

## If Issues Persist

1. Check browser console for specific error messages
2. Verify `components/ui/BlurView.web.tsx` exists
3. Verify `components/ui/MapView.web.tsx` exists
4. Try removing `webpack.config.js` and using Metro only
5. Check that `app.json` has `"bundler": "metro"` in web config

## Notes

- Native features (maps, true blur, notifications) require mobile apps
- Web version is a fallback for development/testing
- Production should use native iOS/Android builds

