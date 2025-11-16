/**
 * RegisterScreen
 * Premium registration screen with glass-morphism UI and Firebase Auth
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GlassCard, PrimaryButton, InputField } from '@/components/ui';
import { colors, gradients, shadows } from '@/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from '@/utils/validation';

export default function RegisterScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) {
      const validation = validateName(text);
      setNameError(validation.error || '');
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      const validation = validateEmail(text);
      setEmailError(validation.error || '');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      const validation = validatePassword(text);
      setPasswordError(validation.error || '');
    }
    // Re-validate confirm password if it exists
    if (confirmPassword) {
      const confirmValidation = validateConfirmPassword(text, confirmPassword);
      setConfirmPasswordError(confirmValidation.error || '');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      const validation = validateConfirmPassword(password, text);
      setConfirmPasswordError(validation.error || '');
    }
  };

  const handleRegister = async () => {
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate all inputs
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(
      password,
      confirmPassword
    );

    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || '');
      return;
    }

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      return;
    }

    if (!confirmPasswordValidation.isValid) {
      setConfirmPasswordError(confirmPasswordValidation.error || '');
      return;
    }

    // Attempt registration
    try {
      await register(email, password);
      Alert.alert(
        'Success',
        'Account created successfully! You are now signed in.',
        [
          {
            text: 'OK',
            // Navigation will be handled by AuthContext and AppNavigator
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={gradients.nature.forest.colors}
        start={gradients.nature.forest.start}
        end={gradients.nature.forest.end}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(100)}
            style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.text.inverse.light}
              />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={gradients.eco.default.colors}
                start={gradients.eco.default.start}
                end={gradients.eco.default.end}
                style={styles.logo}>
                <Ionicons name="person-add" size={40} color={colors.text.inverse.light} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Smart River Watch</Text>
          </Animated.View>

          {/* Registration Form */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.formContainer}>
            <GlassCard intensity={90} tint="light" style={styles.card}>
              <View style={styles.form}>
                {/* Name Input */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(300)}
                  style={styles.inputWrapper}>
                  <InputField
                    label="Full Name"
                    icon="person-outline"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={handleNameChange}
                    autoCapitalize="words"
                    autoComplete="name"
                    error={nameError}
                    variant="glass"
                  />
                </Animated.View>

                {/* Email Input */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(400)}
                  style={styles.inputWrapper}>
                  <InputField
                    label="Email Address"
                    icon="mail-outline"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    error={emailError}
                    variant="glass"
                  />
                </Animated.View>

                {/* Password Input */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(500)}
                  style={styles.inputWrapper}>
                  <InputField
                    label="Password"
                    icon="lock-closed-outline"
                    placeholder="Create a password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    error={passwordError}
                    rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    helperText="Must be at least 6 characters"
                    variant="glass"
                  />
                </Animated.View>

                {/* Confirm Password Input */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(600)}
                  style={styles.inputWrapper}>
                  <InputField
                    label="Confirm Password"
                    icon="lock-closed-outline"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    error={confirmPasswordError}
                    rightIcon={
                      showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                    }
                    onRightIconPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    variant="glass"
                  />
                </Animated.View>

                {/* Register Button */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(700)}
                  style={styles.buttonContainer}>
                  <PrimaryButton
                    title="Create Account"
                    onPress={handleRegister}
                    variant="success"
                    size="lg"
                    icon="checkmark-circle-outline"
                    iconPosition="right"
                    loading={loading}
                    fullWidth
                  />
                </Animated.View>

                {/* Login Link */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(800)}
                  style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.replace('Login')}
                    activeOpacity={0.7}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.inverse.light,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.inverse.light,
    opacity: 0.9,
  },
  formContainer: {
    width: '100%',
  },
  card: {
    padding: 24,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary.light,
  },
  loginLink: {
    fontSize: 14,
    color: colors.ecoGreen[500],
    fontWeight: '600',
  },
});

