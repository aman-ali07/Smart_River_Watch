# App Icon & Splash Screen Guide

## Current Configuration

### App Icon
- **Location**: `./assets/images/icon.png`
- **Size**: 1024x1024 pixels (required)
- **Format**: PNG with transparency support
- **Current**: Default Expo icon (placeholder)

### Android Adaptive Icon
- **Foreground**: `./assets/images/android-icon-foreground.png` (1024x1024)
- **Background**: `./assets/images/android-icon-background.png` (1024x1024)
- **Monochrome**: `./assets/images/android-icon-monochrome.png` (1024x1024)
- **Background Color**: `#1E90FF` (Primary Blue)

### Splash Screen
- **Image**: `./assets/images/splash-icon.png`
- **Size**: 200x200 pixels (recommended)
- **Background Color**: `#1E90FF` (Primary Blue)
- **Resize Mode**: `contain`

## How to Change App Icon

### Step 1: Prepare Your Icon

1. **Create/Design Your Icon**
   - Size: 1024x1024 pixels
   - Format: PNG
   - Background: Transparent or solid color
   - Design: Simple, recognizable, works at small sizes

2. **Design Guidelines**
   - Keep important elements in the center (safe zone)
   - Avoid text or fine details
   - Use high contrast colors
   - Test at different sizes (16x16 to 1024x1024)

### Step 2: Replace the Icon Files

#### For iOS & General App Icon:
```bash
# Replace the main icon
cp your-icon.png ./assets/images/icon.png
```

#### For Android Adaptive Icon:

1. **Foreground Icon** (`android-icon-foreground.png`)
   - Size: 1024x1024 pixels
   - Should be the main icon design
   - Keep important content within 432x432 center area (safe zone)
   - Transparent background

2. **Background Icon** (`android-icon-background.png`)
   - Size: 1024x1024 pixels
   - Solid color or gradient background
   - No important content (will be cropped)

3. **Monochrome Icon** (`android-icon-monochrome.png`)
   - Size: 1024x1024 pixels
   - Single color icon (usually white or black)
   - Used for themed icons on Android 13+

**Example:**
```bash
# Replace Android adaptive icon files
cp your-foreground.png ./assets/images/android-icon-foreground.png
cp your-background.png ./assets/images/android-icon-background.png
cp your-monochrome.png ./assets/images/android-icon-monochrome.png
```

### Step 3: Update Background Color (Optional)

Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#YOUR_COLOR_HERE"
      }
    }
  }
}
```

### Step 4: Rebuild the App

After changing icons, you need to rebuild:
```bash
# For preview build
npm run build:android:preview

# For production build
npm run build:android:production
```

## How to Change Splash Screen

### Step 1: Prepare Splash Screen Image

1. **Create Your Splash Image**
   - Size: 200x200 to 400x400 pixels (recommended)
   - Format: PNG
   - Transparent background (optional)
   - Simple logo or app name

2. **Design Guidelines**
   - Center the content
   - Use high contrast
   - Keep it simple and fast-loading
   - Match your app's branding

### Step 2: Replace Splash Image

```bash
cp your-splash.png ./assets/images/splash-icon.png
```

### Step 3: Update Splash Background Color

Edit `app.json`:
```json
{
  "expo": {
    "splash": {
      "backgroundColor": "#YOUR_COLOR_HERE"
    }
  }
}
```

### Step 4: Rebuild the App

```bash
npm run build:android:preview
```

## Icon Design Tools

### Online Tools:
- **Figma**: Professional design tool
- **Canva**: Easy-to-use design tool
- **Icon Generator**: https://www.appicon.co/
- **Adaptive Icon Generator**: https://romannurik.github.io/AndroidAssetStudio/icons-adaptive.html

### Recommended Icon Sizes:
- **App Icon**: 1024x1024 px
- **Splash Icon**: 200x200 to 400x400 px
- **Android Foreground**: 1024x1024 px (432x432 safe zone)
- **Android Background**: 1024x1024 px
- **Android Monochrome**: 1024x1024 px

## Current Theme Colors

- **Primary Blue**: `#1E90FF`
- **Deep Blue**: `#0057A7`
- **Eco Green**: `#32CD32`
- **Warning Yellow**: `#FFCC00`
- **Alert Red**: `#FF3B30`

## Quick Reference

### Files to Replace:
1. `./assets/images/icon.png` - Main app icon
2. `./assets/images/android-icon-foreground.png` - Android foreground
3. `./assets/images/android-icon-background.png` - Android background
4. `./assets/images/android-icon-monochrome.png` - Android monochrome
5. `./assets/images/splash-icon.png` - Splash screen image

### Configuration File:
- `app.json` - Icon and splash screen settings

### After Changes:
- Run `npm run build:android:preview` to test
- Icons are cached, so rebuild is required

## Notes

- Icons are cached by Expo/EAS, so always rebuild after changes
- Test icons on actual devices at different sizes
- Android adaptive icons have a safe zone (432x432 center area)
- iOS icons are automatically rounded on the home screen
- Splash screen should load quickly (keep file size small)

