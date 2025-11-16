/**
 * InputField Component
 * Premium input field with label and icon
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, typography } from '@/theme';
import { BlurView } from 'expo-blur';

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  helperText?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'glass';
}

export default function InputField({
  label,
  icon,
  error,
  helperText,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  style,
  ...textInputProps
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const InputComponent = variant === 'glass' ? BlurView : View;

  const inputStyle = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    variant === 'glass' && styles.inputGlass,
    style,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={20}
              color={isFocused ? colors.primary[500] : colors.gray[400]}
            />
          </View>
        )}
        {variant === 'glass' ? (
          <BlurView
            intensity={60}
            tint="light"
            style={[
              styles.inputGlass,
              isFocused && styles.inputFocused,
              error && styles.inputError,
              !icon && { paddingLeft: 16 },
              style,
            ]}>
            <TextInput
              style={styles.textInput}
              placeholderTextColor={colors.gray[400]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...textInputProps}
            />
          </BlurView>
        ) : (
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              error && styles.inputError,
              !icon && { paddingLeft: 16 },
              style,
            ]}
            placeholderTextColor={colors.gray[400]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...textInputProps}
          />
        )}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            activeOpacity={0.7}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.textStyles.label,
    color: colors.text.primary.light,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: colors.background.light,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingLeft: 48, // Default with icon space
    paddingRight: 16,
    ...typography.textStyles.body,
    color: colors.text.primary.light,
    ...shadows.sm,
  },
  inputGlass: {
    flex: 1,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 48, // Default with icon space
    paddingRight: 16,
    ...shadows.sm,
  },
  textInput: {
    flex: 1,
    ...typography.textStyles.body,
    color: colors.text.primary.light,
    padding: 0,
    height: 52,
  },
  inputFocused: {
    borderColor: colors.primary[500],
    ...shadows.md,
  },
  inputError: {
    borderColor: colors.alert[500],
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  errorText: {
    ...typography.textStyles.caption,
    color: colors.alert[500],
    marginTop: 4,
  },
  helperText: {
    ...typography.textStyles.caption,
    color: colors.text.secondary.light,
    marginTop: 4,
  },
});

