# EAS CLI Setup - Fixed Permission Issue

## ✅ Solution Applied

Instead of installing EAS CLI globally (which requires sudo), I've installed it **locally** in your project. This is the recommended approach and avoids permission issues.

## 🚀 How to Use EAS CLI Now

### Option 1: Use npm script (Recommended)
```bash
npm run eas -- [command]
```

Examples:
```bash
# Login to Expo
npm run eas -- login

# Configure project
npm run eas -- build:configure

# Build Android APK
npm run build:android:preview
```

### Option 2: Use npx (No installation needed)
```bash
npx eas-cli [command]
```

Examples:
```bash
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```

### Option 3: Use npx eas (Shorter)
```bash
npx eas [command]
```

Examples:
```bash
npx eas login
npx eas build:configure
npx eas build --platform android --profile preview
```

## 📋 Common EAS Commands

```bash
# Login to Expo account
npm run eas -- login
# or: npx eas login

# Configure EAS for your project (first time)
npm run eas -- build:configure
# or: npx eas build:configure

# View build status
npm run eas -- build:list
# or: npx eas build:list

# Build Android APK (preview)
npm run build:android:preview

# Build Android APK (production)
npm run build:android:production

# Build iOS (preview)
npm run build:ios:preview

# Build iOS (production)
npm run build:ios:production

# Download latest build
npm run eas -- build:download
# or: npx eas build:download

# View build logs
npm run eas -- build:view
# or: npx eas build:view
```

## ✅ Next Steps

1. **Login to Expo:**
   ```bash
   npm run eas -- login
   # or: npx eas login
   ```

2. **Configure EAS (if not already done):**
   ```bash
   npm run eas -- build:configure
   # or: npx eas build:configure
   ```

3. **Start building:**
   ```bash
   npm run build:android:preview
   ```

## 🔍 Why This Approach?

- ✅ **No sudo needed** - No permission issues
- ✅ **Project-specific** - EAS CLI version is locked to your project
- ✅ **Team-friendly** - Everyone uses the same version
- ✅ **Recommended by Expo** - Best practice for EAS CLI

## 📝 Note

The build scripts in `package.json` already use `eas` directly, so they'll work automatically:
- `npm run build:android:preview` ✅
- `npm run build:android:production` ✅
- `npm run build:ios:preview` ✅
- `npm run build:ios:production` ✅

You only need `npm run eas --` or `npx eas` for other commands like `login`, `build:configure`, etc.

