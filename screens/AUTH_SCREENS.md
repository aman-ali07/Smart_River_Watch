# Authentication Screens

Premium authentication screens with glass-morphism UI, Firebase Auth integration, and form validation.

## Screens Created

### 1. LoginScreen
- **Location**: `screens/LoginScreen.tsx`
- **Features**:
  - Glass-morphism UI with blur effects
  - Email and password validation
  - Animated text fields with fade-in effects
  - Gradient primary button
  - Show/hide password toggle
  - Forgot password navigation
  - Register navigation
  - Firebase Auth integration
  - Loading states
  - Error handling

### 2. RegisterScreen
- **Location**: `screens/RegisterScreen.tsx`
- **Features**:
  - Glass-morphism UI with blur effects
  - Name, email, password, and confirm password validation
  - Animated text fields with fade-in effects
  - Gradient success button
  - Show/hide password toggles for both password fields
  - Password strength helper text
  - Firebase Auth integration
  - Loading states
  - Success alerts
  - Back navigation
  - Login navigation

### 3. ForgotPasswordScreen
- **Location**: `screens/ForgotPasswordScreen.tsx`
- **Features**:
  - Glass-morphism UI with blur effects
  - Email validation
  - Animated text fields
  - Gradient primary button
  - Success state with animated icon
  - Firebase password reset integration
  - Loading states
  - Back navigation
  - Login navigation

## Supporting Files

### Firebase Auth Service
- **Location**: `services/auth.ts`
- **Functions**:
  - `signIn(email, password)` - Sign in with email and password
  - `register(email, password)` - Register new user
  - `resetPassword(email)` - Send password reset email
  - `getCurrentUser()` - Get current authenticated user
  - `getAuthErrorMessage(errorCode)` - Convert Firebase error codes to user-friendly messages

### Validation Utilities
- **Location**: `utils/validation.ts`
- **Functions**:
  - `validateEmail(email)` - Validate email format
  - `validatePassword(password)` - Validate password (min 6 characters)
  - `validateConfirmPassword(password, confirmPassword)` - Validate password match
  - `validateName(name)` - Validate name (min 2 characters)

## Design Features

### Glass-Morphism
- All screens use `GlassCard` component with blur effects
- Translucent backgrounds with border highlights
- Premium, modern aesthetic

### Animations
- Fade-in animations for header elements
- Staggered fade-in for form fields
- Smooth transitions using `react-native-reanimated`
- Entry animations with delays for visual appeal

### Gradients
- Login: Water flow gradient (blue to cyan)
- Register: Nature forest gradient (green)
- Forgot Password: Primary deep gradient (blue)
- Button gradients matching screen themes

### Form Validation
- Real-time validation on input change
- Error messages displayed below fields
- Visual error states (red borders)
- Helper text for guidance

## Navigation

All screens are integrated into the navigation stack:
- **Initial Route**: Login
- **Navigation Flow**:
  - Login → Register
  - Login → ForgotPassword
  - Register → Login (after success)
  - ForgotPassword → Login (after success)
  - Login → MainTabs (after successful login)

## Usage

### Firebase Configuration

Make sure to configure Firebase in `services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};
```

### Environment Variables

Create a `.env` file:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Component Usage

### LoginScreen Example
```tsx
import LoginScreen from '@/screens/LoginScreen';

// Already integrated in navigation
// Access via: navigation.navigate('Login')
```

### RegisterScreen Example
```tsx
import RegisterScreen from '@/screens/RegisterScreen';

// Already integrated in navigation
// Access via: navigation.navigate('Register')
```

### ForgotPasswordScreen Example
```tsx
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';

// Already integrated in navigation
// Access via: navigation.navigate('ForgotPassword')
```

## Features Implemented

✅ Glass-morphism UI with blur effects  
✅ Gradient primary buttons  
✅ Email/password validation  
✅ Animated text fields  
✅ Firebase Auth integration  
✅ Loading states  
✅ Error handling  
✅ Success states  
✅ Navigation between screens  
✅ Show/hide password toggles  
✅ Real-time validation  
✅ User-friendly error messages  

## Next Steps

1. **Configure Firebase**: Add your Firebase config to environment variables
2. **Test Authentication**: Test login, register, and password reset flows
3. **Add Auth State Listener**: Implement auth state listener to automatically navigate on login/logout
4. **Add Social Login**: Optionally add Google, Apple, or other social login methods
5. **Add Email Verification**: Add email verification flow for new registrations

## Customization

### Change Gradient Themes
Edit the gradient props in each screen:
- Login: `gradients.water.flow`
- Register: `gradients.nature.forest`
- ForgotPassword: `gradients.primary.deep`

### Adjust Animation Timing
Modify the `delay` values in `FadeInDown` and `FadeInUp` components:
```tsx
entering={FadeInDown.duration(400).delay(300)}
```

### Customize Validation Rules
Edit `utils/validation.ts` to add custom validation rules:
```typescript
export function validatePassword(password: string): ValidationResult {
  // Add custom rules here
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  // ... more rules
}
```

