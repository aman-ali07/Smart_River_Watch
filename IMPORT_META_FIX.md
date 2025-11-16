# import.meta Error Fix

## Error
```
Uncaught SyntaxError: Cannot use 'import.meta' outside a module
```

## Cause
This error occurs when a dependency uses `import.meta` (ESM syntax) but Metro bundler isn't configured to handle it properly for web.

## Solution Applied

1. **Updated Metro Config** - Added transformer configuration
2. **Cleared Cache** - Need to clear Metro cache

## Steps to Fix

1. **Stop the server** (Ctrl+C)

2. **Clear all caches:**
   ```bash
   rm -rf node_modules/.cache
   rm -rf .expo
   rm -rf .metro
   ```

3. **Restart with clear cache:**
   ```bash
   npx expo start --clear --web
   ```

## Alternative: If Still Failing

If the error persists, it might be coming from a specific dependency. Try:

1. **Check which package is causing it:**
   - Look at the error stack trace in browser console
   - Find the package name in the error

2. **Temporary workaround:**
   - If it's a non-critical dependency, you might need to exclude it from web builds
   - Or find a web-compatible alternative

3. **Update Expo:**
   ```bash
   npx expo install --fix
   ```

## Notes

- `import.meta` is ESM syntax that requires proper module configuration
- Metro should handle this automatically, but sometimes cache issues cause problems
- The error is usually resolved by clearing cache and restarting

