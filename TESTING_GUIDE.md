# Firebase Authentication Testing Guide

## 🧪 Testing Steps

### Step 1: Verify Firebase Authentication is Enabled

**CRITICAL:** Before testing, make sure Email/Password authentication is enabled:

1. Go to: https://console.firebase.google.com/project/river-watch-66856/authentication
2. Check if "Email/Password" is enabled (should show as "Enabled")
3. If not enabled, click on it and enable it

### Step 2: Start the App

```bash
npx expo start --clear
```

Then:
- Press `w` to open in web browser
- Or scan QR code for mobile

### Step 3: Test Registration

1. **Open the app** (should show Login screen)
2. **Click "Sign Up"** or navigate to Register screen
3. **Fill in the form:**
   - Name: `Test User`
   - Email: `test@example.com` (use a real email you can access)
   - Password: `test123456` (min 6 characters)
   - Confirm Password: `test123456`
4. **Click "Create Account"**
5. **Expected Result:**
   - ✅ Success message appears
   - ✅ Automatically logged in
   - ✅ Navigated to Dashboard/Home screen
   - ✅ User appears in Firebase Console > Authentication > Users

### Step 4: Test Login

1. **Logout** (if logged in)
2. **Go to Login screen**
3. **Enter credentials:**
   - Email: `test@example.com`
   - Password: `test123456`
4. **Click "Sign In"**
5. **Expected Result:**
   - ✅ Successfully logged in
   - ✅ Navigated to Dashboard
   - ✅ No error messages

### Step 5: Test Password Reset

1. **Go to Login screen**
2. **Click "Forgot Password?"**
3. **Enter email:** `test@example.com`
4. **Click "Send Reset Link"**
5. **Expected Result:**
   - ✅ Success message
   - ✅ Email sent (check inbox)
   - ✅ Can reset password via email link

### Step 6: Test Error Handling

**Test Invalid Login:**
1. Try logging in with wrong password
2. **Expected:** Error message "Incorrect password"

**Test Invalid Email:**
1. Try registering with invalid email format
2. **Expected:** Validation error "Invalid email address"

**Test Weak Password:**
1. Try registering with password less than 6 characters
2. **Expected:** Validation error "Password should be at least 6 characters"

## ✅ Success Indicators

### In the App:
- ✅ Can register new users
- ✅ Can login with registered users
- ✅ Can logout
- ✅ Can reset password
- ✅ Navigation works correctly
- ✅ No console errors

### In Firebase Console:
- ✅ Users appear in Authentication > Users
- ✅ User emails are verified
- ✅ User IDs are generated

### In Browser Console (F12):
- ✅ No "Firebase not configured" warnings
- ✅ No authentication errors
- ✅ Firebase initialized successfully

## 🚨 Common Issues & Fixes

### Issue: "Firebase not configured" warning
**Fix:**
- Check `.env` file has all Firebase variables
- Restart Expo with `--clear` flag
- Verify variables start with `EXPO_PUBLIC_`

### Issue: "auth/operation-not-allowed" error
**Fix:**
- Enable Email/Password in Firebase Console
- Go to Authentication > Sign-in method > Email/Password > Enable

### Issue: "auth/invalid-api-key" error
**Fix:**
- Verify API key in `.env` matches Firebase Console
- Check for typos or extra spaces

### Issue: Registration works but login fails
**Fix:**
- Check password is correct
- Verify user exists in Firebase Console
- Check for email verification requirements

### Issue: App shows blank screen
**Fix:**
- Check browser console for errors
- Verify Firebase is initialized
- Check AuthContext is not returning null

## 📋 Testing Checklist

- [ ] Firebase Authentication enabled in Console
- [ ] Expo server started with `--clear`
- [ ] App loads without errors
- [ ] Can register new user
- [ ] User appears in Firebase Console
- [ ] Can login with registered user
- [ ] Can logout
- [ ] Can reset password
- [ ] Error handling works (invalid credentials)
- [ ] Validation works (invalid email, weak password)
- [ ] Navigation works correctly
- [ ] No console errors

## 🎯 Quick Test Script

```bash
# 1. Start server
npx expo start --clear

# 2. Open browser (press 'w' or go to http://localhost:8081)

# 3. Test in browser:
#    - Register: test@example.com / test123456
#    - Login: test@example.com / test123456
#    - Check Firebase Console for user

# 4. Check console (F12) for errors
```

## 📝 Test Results Template

After testing, note:

- [ ] Registration: ✅ / ❌
- [ ] Login: ✅ / ❌
- [ ] Logout: ✅ / ❌
- [ ] Password Reset: ✅ / ❌
- [ ] Error Handling: ✅ / ❌
- [ ] Firebase Console: ✅ / ❌ (users visible)

## 🚀 Next Steps After Testing

If everything works:
1. ✅ Firebase Auth is fully functional
2. ✅ Ready for production (after security rules setup)
3. ✅ Can add more features (social login, email verification, etc.)

If issues found:
1. Check error messages in console
2. Verify Firebase Console settings
3. Review `.env` file configuration
4. Check network connectivity

Good luck with testing! 🎉

