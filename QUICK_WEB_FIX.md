# Quick Web Fix - Still Getting Error?

If you're still getting the `codegenNativeComponent` error, try these steps in order:

## Step 1: Clear Everything and Restart

```bash
# Stop the server (Ctrl+C)
# Clear all caches
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear --web
```

## Step 2: If Step 1 Doesn't Work

The Metro resolver might not be working. Try this alternative:

1. **Delete webpack.config.js** (we're using Metro, not webpack):
   ```bash
   rm webpack.config.js
   ```

2. **Install babel-plugin-module-resolver**:
   ```bash
   npm install --save-dev babel-plugin-module-resolver
   ```

3. **Update babel.config.js** to include the module resolver:
   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
       plugins: [
         "react-native-reanimated/plugin",
         [
           "module-resolver",
           {
             alias: {
               "expo-blur": "./components/ui/BlurView.web.tsx",
               "react-native-maps": "./components/ui/MapView.web.tsx",
             },
             extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".jsx", ".js"],
           },
         ],
       ],
     };
   };
   ```

4. **Restart with clear cache**:
   ```bash
   npx expo start --clear --web
   ```

## Step 3: Nuclear Option - Manual Module Replacement

If nothing works, we can create wrapper components that all files import instead of the native modules directly. But try Steps 1-2 first!

## What Should Happen

After these steps:
- ✅ No `codegenNativeComponent` error
- ✅ App loads in browser
- ✅ BlurView shows semi-transparent backgrounds
- ✅ MapView shows placeholder message

## Still Not Working?

Check the browser console for the exact error message and which file is causing it. The error might be coming from a different native module.

