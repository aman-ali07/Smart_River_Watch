# Firebase Authentication - Updated to Direct Function Calls

## ✅ Changes Made

### 1. Updated Auth Service (`services/auth.ts`)

**Now uses direct Firebase function calls:**

- ✅ `signInWithEmailAndPassword()` - Direct function call
- ✅ `createUserWithEmailAndPassword()` - Direct function call
- ✅ `signInWithPopup(GoogleAuthProvider())` - Added Google sign-in
- ✅ Added auth initialization checks
- ✅ Better error handling

### 2. Added Google Authentication

**New function:**
```typescript
export async function signInWithGoogle(): Promise<UserCredential>
```

**Features:**
- Uses `signInWithPopup()` with `GoogleAuthProvider()`
- Includes profile and email scopes
- Handles popup closed by user
- Proper error handling

### 3. Updated AuthContext

**Added:**
- `loginWithGoogle()` method to AuthContext
- Available via `useAuth()` hook

**Usage:**
```typescript
const { loginWithGoogle } = useAuth();

// Sign in with Google
await loginWithGoogle();
```

## 🚀 How to Use

### Email/Password Authentication

**Login:**
```typescript
import { signIn } from '@/services/auth';

// Direct function call
const userCredential = await signInWithEmailAndPassword(
  auth,
  email,
  password
);

// Or use the service function
await signIn(email, password);
```

**Register:**
```typescript
import { register } from '@/services/auth';

// Direct function call
const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

// Or use the service function
await register(email, password);
```

### Google Authentication

**Using AuthContext:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { loginWithGoogle } = useAuth();

// Sign in with Google
try {
  await loginWithGoogle();
  // User will be automatically logged in
} catch (error) {
  console.error('Google sign-in failed:', error);
}
```

**Direct function call:**
```typescript
import { signInWithGoogle } from '@/services/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Using service function
await signInWithGoogle();

// Or direct call
const provider = new GoogleAuthProvider();
const userCredential = await signInWithPopup(auth, provider);
```

## 📋 Function Reference

### Direct Firebase Functions

```typescript
// Email/Password
signInWithEmailAndPassword(auth, email, password)
createUserWithEmailAndPassword(auth, email, password)

// Google Sign-in
const provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)

// Password Reset
sendPasswordResetEmail(auth, email)
```

### Service Functions (Wrapped)

```typescript
// From services/auth.ts
signIn(email, password)
register(email, password)
resetPassword(email)
signInWithGoogle()
```

### Context Methods (Recommended)

```typescript
// From contexts/AuthContext.tsx (via useAuth hook)
login(email, password)
register(email, password)
forgotPassword(email)
loginWithGoogle()
logout()
```

## 🔧 Enable Google Sign-in in Firebase Console

**Important:** You must enable Google authentication in Firebase Console:

1. Go to: https://console.firebase.google.com/project/river-watch-66856/authentication
2. Click "Sign-in method" tab
3. Click on "Google"
4. **Enable** it
5. Enter your project support email
6. Click "Save"

## 📝 Example: Add Google Sign-in Button

Add to your `LoginScreen.tsx`:

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { loginWithGoogle, loading } = useAuth();

const handleGoogleSignIn = async () => {
  try {
    await loginWithGoogle();
    // Navigation handled automatically by AuthContext
  } catch (error: any) {
    Alert.alert('Google Sign-in Failed', error.message);
  }
};

// In your JSX:
<Button
  onPress={handleGoogleSignIn}
  disabled={loading}
  title="Sign in with Google"
/>
```

## ✅ All Functions Now Use Direct Calls

| Function | Direct Call | Service Wrapper | Context Method |
|----------|------------|-----------------|----------------|
| Email Login | `signInWithEmailAndPassword()` | `signIn()` | `login()` |
| Email Register | `createUserWithEmailAndPassword()` | `register()` | `register()` |
| Google Sign-in | `signInWithPopup(GoogleAuthProvider())` | `signInWithGoogle()` | `loginWithGoogle()` |
| Password Reset | `sendPasswordResetEmail()` | `resetPassword()` | `forgotPassword()` |

## 🎯 Next Steps

1. **Enable Google Sign-in in Firebase Console** (if you want Google auth)
2. **Add Google Sign-in button** to LoginScreen (optional)
3. **Test all authentication methods**
4. **Update UI** to include Google sign-in option

All authentication functions now use the direct Firebase function calls as requested! 🚀

