# Clear Cache and Restart - import.meta Fix

## Quick Fix Steps

The `import.meta` error is likely a caching issue. Follow these steps:

```bash
# 1. Stop the server (Ctrl+C if running)

# 2. Clear ALL caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf .metro
rm -rf .expo-shared

# 3. Clear watchman (if installed)
watchman watch-del-all 2>/dev/null || true

# 4. Restart with clear cache
npx expo start --clear --web
```

## If Still Failing

The error might be from `tailwindcss` (used by NativeWind). Try:

1. **Check browser console** for the exact file causing the error
2. **Try disabling NativeWind temporarily** to see if that's the issue
3. **Update dependencies:**
   ```bash
   npx expo install --fix
   npm update
   ```

## What Changed

- Updated Metro config to better handle ESM modules
- Added source extensions for `.mjs` and `.cjs` files
- Enabled package exports support

The cache clear should resolve the issue in most cases.

