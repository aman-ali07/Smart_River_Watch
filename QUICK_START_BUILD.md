# Quick Start: Build Android APK for Demo

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2: Login to Expo

```bash
eas login
```

If you don't have an Expo account, create one at: https://expo.dev/signup

## Step 3: Configure Project (First Time Only)

```bash
eas build:configure
```

This will link your project to EAS (already configured in `eas.json`).

## Step 4: Build Android APK

```bash
npm run build:android:preview
```

Or directly:
```bash
eas build --platform android --profile preview
```

## Step 5: Wait for Build

- Build will run on Expo servers (10-20 minutes)
- You'll get a URL to track progress
- You'll receive an email when build completes

## Step 6: Download APK

1. Visit the build URL from Step 5
2. Click "Download" button
3. Save the APK file

## Step 7: Install on Android Device

### Option A: Direct Install
1. Transfer APK to Android device
2. Enable "Install from Unknown Sources" in Settings
3. Tap APK file to install

### Option B: QR Code
1. Scan QR code from Expo dashboard
2. Download directly to device
3. Install when prompted

## Troubleshooting

**Build fails?**
- Check you're logged in: `eas whoami`
- Verify `app.json` is valid
- Check Expo dashboard for error logs

**APK won't install?**
- Enable "Install from Unknown Sources"
- Check Android version (minimum Android 6.0)
- Try downloading APK again

## Next Steps

- Test the APK on multiple devices
- Share with demo audience
- See `BUILD_GUIDE.md` for detailed instructions
- See `ICON_GUIDE.md` to customize app icon

