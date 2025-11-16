/**
 * ForgotPasswordScreen
 * Premium password reset screen with glass-morphism UI and Firebase Auth
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
import { validateEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      const validation = validateEmail(text);
      setEmailError(validation.error || '');
    }
  };

  const handleResetPassword = async () => {
    // Reset error
    setEmailError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    // Send reset email
    setLoading(true);
    try {
      await forgotPassword(email);
      setEmailSent(true);
      Alert.alert(
        'Email Sent',
        'Please check your email for password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={gradients.primary.deep.colors}
        start={gradients.primary.deep.start}
        end={gradients.primary.deep.end}
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
                colors={gradients.status.info.colors}
                start={gradients.status.info.start}
                end={gradients.status.info.end}
                style={styles.logo}>
                <Ionicons
                  name="key-outline"
                  size={40}
                  color={colors.text.inverse.light}
                />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive reset instructions
            </Text>
          </Animated.View>

          {/* Reset Form */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.formContainer}>
            <GlassCard intensity={90} tint="light" style={styles.card}>
              <View style={styles.form}>
                {emailSent ? (
                  // Success State
                  <Animated.View
                    entering={FadeInDown.duration(400).delay(300)}
                    style={styles.successContainer}>
                    <View style={styles.successIconContainer}>
                      <LinearGradient
                        colors={gradients.status.success.colors}
                        start={gradients.status.success.start}
                        end={gradients.status.success.end}
                        style={styles.successIcon}>
                        <Ionicons
                          name="checkmark-circle"
                          size={64}
                          color={colors.text.inverse.light}
                        />
                      </LinearGradient>
                    </View>
                    <Text style={styles.successTitle}>Email Sent!</Text>
                    <Text style={styles.successText}>
                      We've sent password reset instructions to{'\n'}
                      <Text style={styles.emailText}>{email}</Text>
                    </Text>
                    <Text style={styles.successSubtext}>
                      Please check your inbox and follow the instructions to
                      reset your password.
                    </Text>
                  </Animated.View>
                ) : (
                  // Reset Form
                  <>
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

                    {/* Info Text */}
                    <Animated.View
                      entering={FadeInDown.duration(400).delay(400)}
                      style={styles.infoContainer}>
                      <View style={styles.infoBox}>
                        <Ionicons
                          name="information-circle-outline"
                          size={20}
                          color={colors.primary[500]}
                        />
                        <Text style={styles.infoText}>
                          We'll send you a link to reset your password
                        </Text>
                      </View>
                    </Animated.View>

                    {/* Reset Button */}
                    <Animated.View
                      entering={FadeInDown.duration(400).delay(500)}
                      style={styles.buttonContainer}>
                      <PrimaryButton
                        title="Send Reset Link"
                        onPress={handleResetPassword}
                        variant="primary"
                        size="lg"
                        icon="send-outline"
                        iconPosition="right"
                        loading={loading}
                        fullWidth
                      />
                    </Animated.View>
                  </>
                )}

                {/* Back to Login */}
                <Animated.View
                  entering={FadeInDown.duration(400).delay(600)}
                  style={styles.loginContainer}>
                  <Text style={styles.loginText}>Remember your password? </Text>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.inverse.light,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 20,
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
  infoContainer: {
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.primary[700],
  },
  buttonContainer: {
    marginBottom: 24,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary.light,
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: '600',
    color: colors.primary[500],
  },
  successSubtext: {
    fontSize: 14,
    color: colors.text.muted.light,
    textAlign: 'center',
    lineHeight: 20,
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
    color: colors.primary[500],
    fontWeight: '600',
  },
});

