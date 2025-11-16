/**
 * LoginScreen
 * Premium login screen with glass-morphism UI and Firebase Auth
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
import { validateEmail, validatePassword } from '@/utils/validation';

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      return;
    }

    // Attempt login
    try {
      await login(email, password);
      // Navigation will be handled by AuthContext and AppNavigator
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={gradients.water.flow.colors}
        start={gradients.water.flow.start}
        end={gradients.water.flow.end}
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
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={gradients.primary.default.colors}
                start={gradients.primary.default.start}
                end={gradients.primary.default.end}
                style={styles.logo}>
                <Ionicons name="water" size={48} color={colors.text.inverse.light} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Smart River Watch</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.formContainer}>
            <GlassCard intensity={90} tint="light" style={styles.card}>
              <View style={styles.form}>
                {/* Email Input */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(300)}
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
                  entering={FadeInDown.duration(400).delay(400)}
                  style={styles.inputWrapper}>
                  <InputField
                    label="Password"
                    icon="lock-closed-outline"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    error={passwordError}
                    rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    variant="glass"
                  />
                </Animated.View>

                {/* Forgot Password Link */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(500)}
                  style={styles.forgotPasswordContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    activeOpacity={0.7}>
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Login Button */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(600)}
                  style={styles.buttonContainer}>
                  <PrimaryButton
                    title="Sign In"
                    onPress={handleLogin}
                    variant="primary"
                    size="lg"
                    icon="log-in-outline"
                    iconPosition="right"
                    loading={loading}
                    fullWidth
                  />
                </Animated.View>

                {/* Register Link */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(700)}
                  style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    activeOpacity={0.7}>
                    <Text style={styles.registerLink}>Sign Up</Text>
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
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  title: {
    fontSize: 32,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: colors.text.secondary.light,
  },
  registerLink: {
    fontSize: 14,
    color: colors.primary[500],
    fontWeight: '600',
  },
});

