# Firebase Tools Setup

## ✅ Installed Locally

Firebase Tools has been installed **locally** in your project (not globally) to avoid permission issues.

## 🚀 How to Use Firebase Tools

### Option 1: Use npm script (Recommended)
```bash
npm run firebase -- [command]
```

Examples:
```bash
# Login to Firebase
npm run firebase -- login

# Initialize Firebase in your project
npm run firebase -- init

# Deploy to Firebase Hosting
npm run firebase -- deploy

# View Firebase projects
npm run firebase -- projects:list
```

### Option 2: Use npx (No installation needed)
```bash
npx firebase-tools [command]
```

Or shorter:
```bash
npx firebase [command]
```

Examples:
```bash
npx firebase login
npx firebase init
npx firebase deploy
```

## 📋 Common Firebase Commands

### Authentication & Setup
```bash
# Login to Firebase
npm run firebase -- login

# Initialize Firebase in project
npm run firebase -- init

# List your Firebase projects
npm run firebase -- projects:list
```

### Firestore Database
```bash
# View Firestore data
npm run firebase -- firestore:get [path]

# Set Firestore data
npm run firebase -- firestore:set [path] [data]

# Start Firestore emulator
npm run firebase -- emulators:start --only firestore
```

### Firebase Hosting
```bash
# Deploy to Firebase Hosting
npm run firebase -- deploy --only hosting

# Preview hosting locally
npm run firebase -- serve
```

### Functions
```bash
# Deploy functions
npm run firebase -- deploy --only functions

# Start functions emulator
npm run firebase -- emulators:start --only functions
```

## 🎯 Quick Start

1. **Login to Firebase:**
   ```bash
   npm run firebase -- login
   ```

2. **Initialize Firebase (if needed):**
   ```bash
   npm run firebase -- init
   ```

3. **Use Firebase CLI:**
   ```bash
   npm run firebase -- [any-firebase-command]
   ```

## ✅ Why Local Installation?

- ✅ **No sudo needed** - No permission issues
- ✅ **Project-specific** - Version locked to your project
- ✅ **Team-friendly** - Everyone uses the same version
- ✅ **Recommended approach** - Best practice for Firebase Tools

## 📝 Note

For most Firebase operations, you don't need Firebase Tools CLI. Your app already uses the Firebase SDK directly. Firebase Tools is mainly useful for:
- Deploying to Firebase Hosting
- Managing Firestore from CLI
- Running Firebase emulators
- Managing Firebase Functions

Your app's Firebase integration works through the SDK (already configured in `services/firebase.ts`), so Firebase Tools is optional unless you need CLI features.

