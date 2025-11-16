# EAS Build Guide - Smart River Watch

## Prerequisites

1. **Expo Account**: Sign up at https://expo.dev
2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```
3. **Login to Expo**:
   ```bash
   eas login
   ```

## Initial Setup

### 1. Configure EAS Project

```bash
# Link your project to EAS (first time only)
eas build:configure
```

This will:
- Create `eas.json` (already created)
- Link your project to Expo
- Set up build profiles

### 2. Update Project Details

Edit `app.json` if needed:
- `name`: App display name
- `slug`: URL-friendly name
- `version`: App version
- `android.package`: Android package name (com.smartriverwatch.app)
- `ios.bundleIdentifier`: iOS bundle ID (com.smartriverwatch.app)

## Building Android APK

### Preview Build (For Testing/Demo)

```bash
# Build APK for internal testing
npm run build:android:preview

# Or directly:
eas build --platform android --profile preview
```

**What you get:**
- APK file for Android
- Downloadable from Expo dashboard
- Can be shared for testing
- No Google Play Store submission

### Production Build

```bash
# Build production APK
npm run build:android:production

# Or directly:
eas build --platform android --profile production
```

**What you get:**
- Production-ready APK
- Optimized and signed
- Ready for Play Store submission

## Build Process

1. **Start Build**:
   ```bash
   eas build --platform android --profile preview
   ```

2. **Choose Options**:
   - Build type: APK (for preview) or AAB (for Play Store)
   - Build profile: preview or production

3. **Wait for Build**:
   - Build runs on Expo servers
   - Usually takes 10-20 minutes
   - You'll get a link to track progress

4. **Download APK**:
   - Visit the build URL
   - Download the APK file
   - Install on Android device

## Installing APK on Android Device

### Method 1: Direct Download
1. Download APK from Expo dashboard
2. Transfer to Android device
3. Enable "Install from Unknown Sources" in Settings
4. Tap the APK file to install

### Method 2: QR Code
1. Scan QR code from Expo dashboard
2. Download directly to device
3. Install when download completes

### Method 3: ADB (Android Debug Bridge)
```bash
# Connect device via USB
adb devices

# Install APK
adb install path/to/app.apk
```

## Build Profiles Explained

### Preview Profile
- **Purpose**: Internal testing and demos
- **Build Type**: APK
- **Distribution**: Internal
- **Use Case**: Share with testers, demo purposes

### Production Profile
- **Purpose**: Release to Play Store
- **Build Type**: APK or AAB
- **Distribution**: Production
- **Use Case**: Final release

## Environment Variables (Optional)

If you need environment variables:

1. Create `.env` file:
   ```
   EXPO_PUBLIC_API_URL=https://api.example.com
   EXPO_PUBLIC_PROJECT_ID=your-project-id
   ```

2. Update `eas.json`:
   ```json
   {
     "build": {
       "preview": {
         "env": {
           "EXPO_PUBLIC_API_URL": "https://api.example.com"
         }
       }
     }
   }
   ```

## Troubleshooting

### Build Fails
1. Check `eas.json` configuration
2. Verify `app.json` is valid JSON
3. Check Expo dashboard for error logs
4. Ensure all dependencies are in `package.json`

### APK Won't Install
1. Enable "Install from Unknown Sources"
2. Check Android version compatibility
3. Verify APK is not corrupted
4. Try downloading again

### Icon/Splash Not Updating
1. Rebuild the app (icons are cached)
2. Clear Expo cache: `expo start -c`
3. Verify file paths in `app.json`

## Quick Commands Reference

```bash
# Login to Expo
eas login

# Configure project (first time)
eas build:configure

# Build Android APK (preview)
npm run build:android:preview

# Build Android APK (production)
npm run build:android:production

# View build status
eas build:list

# Download build
eas build:download

# View build logs
eas build:view
```

## Next Steps After Building

1. **Test the APK**:
   - Install on multiple Android devices
   - Test all features
   - Check performance

2. **Share for Demo**:
   - Upload APK to cloud storage
   - Share download link
   - Or use Expo's shareable link

3. **Prepare for Play Store** (if needed):
   - Create Play Store listing
   - Prepare screenshots
   - Write app description
   - Set up pricing

## Important Notes

- **First Build**: May take longer (20-30 minutes)
- **Subsequent Builds**: Usually faster (10-15 minutes)
- **Free Tier**: Limited builds per month
- **Paid Tier**: Unlimited builds, faster queues

## Support

- **EAS Documentation**: https://docs.expo.dev/build/introduction/
- **Expo Forums**: https://forums.expo.dev/
- **Discord**: https://chat.expo.dev/

