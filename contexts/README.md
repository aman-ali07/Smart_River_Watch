# AuthContext

Authentication context with Firebase Auth integration, persistence, and automatic navigation.

## Features

- ✅ User state management
- ✅ Firebase Auth integration
- ✅ Auth persistence with AsyncStorage
- ✅ Automatic navigation on login/logout
- ✅ Loading states
- ✅ Error handling

## Usage

### Basic Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Welcome, {user.email}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

### Login

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LoginComponent() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation to Dashboard is automatic
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Button
      title="Login"
      onPress={handleLogin}
      loading={loading}
    />
  );
}
```

### Register

```tsx
import { useAuth } from '@/contexts/AuthContext';

function RegisterComponent() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      // User is automatically signed in and navigated to Dashboard
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Button
      title="Register"
      onPress={handleRegister}
      loading={loading}
    />
  );
}
```

### Forgot Password

```tsx
import { useAuth } from '@/contexts/AuthContext';

function ForgotPasswordComponent() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Button
      title="Send Reset Email"
      onPress={handleReset}
    />
  );
}
```

### Logout

```tsx
import { useAuth } from '@/contexts/AuthContext';

function ProfileComponent() {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation to Login is automatic
    } catch (error: any) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        loading={loading}
      />
    </View>
  );
}
```

## API Reference

### AuthContextType

```typescript
interface AuthContextType {
  user: User | null;           // Current authenticated user
  loading: boolean;            // Loading state
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

### Methods

#### `login(email, password)`
Signs in a user with email and password.
- **Parameters**: 
  - `email: string` - User's email
  - `password: string` - User's password
- **Returns**: `Promise<void>`
- **Throws**: Error with user-friendly message
- **Side Effects**: Updates `user` state, navigates to Dashboard

#### `register(email, password)`
Creates a new user account and signs them in.
- **Parameters**: 
  - `email: string` - User's email
  - `password: string` - User's password
- **Returns**: `Promise<void>`
- **Throws**: Error with user-friendly message
- **Side Effects**: Updates `user` state, navigates to Dashboard

#### `forgotPassword(email)`
Sends a password reset email.
- **Parameters**: 
  - `email: string` - User's email
- **Returns**: `Promise<void>`
- **Throws**: Error with user-friendly message

#### `logout()`
Signs out the current user.
- **Returns**: `Promise<void>`
- **Throws**: Error if logout fails
- **Side Effects**: Clears `user` state, clears AsyncStorage, navigates to Login

## Auth Persistence

The AuthContext automatically persists authentication state:

1. **Firebase Auth State Listener**: Listens to Firebase auth state changes
2. **AsyncStorage**: Stores auth state locally for quick restoration
3. **Automatic Restoration**: Restores auth state on app restart

### How It Works

1. On app start, `onAuthStateChanged` listener is set up
2. Auth state is stored in AsyncStorage when user signs in
3. Auth state is cleared from AsyncStorage when user signs out
4. Navigation automatically redirects based on auth state

## Navigation

The AuthContext works with `AppNavigator` to automatically handle navigation:

- **User logged in** → Navigates to `MainTabs` (Dashboard)
- **User logged out** → Navigates to `Login`
- **Navigation happens automatically** when auth state changes

## Error Handling

All methods throw errors with user-friendly messages. Common errors:

- `Invalid email address`
- `Incorrect password`
- `An account with this email already exists`
- `Password should be at least 6 characters`
- `Network error. Please check your connection`

## Setup

The AuthContext is already set up in `App.tsx`:

```tsx
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

## User Object

The `user` object is a Firebase `User` object with properties:

- `uid: string` - User's unique ID
- `email: string | null` - User's email
- `emailVerified: boolean` - Whether email is verified
- `displayName: string | null` - User's display name
- `photoURL: string | null` - User's photo URL
- And more Firebase User properties

## Best Practices

1. **Always check loading state** before accessing user
2. **Handle errors** with try-catch blocks
3. **Use loading state** to show loading indicators
4. **Don't manually navigate** - let AuthContext handle it
5. **Check user existence** before accessing user properties

## Example: Protected Route

```tsx
import { useAuth } from '@/contexts/AuthContext';

function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Text>Please login</Text>;
  }

  return <Text>Protected content for {user.email}</Text>;
}
```

