# Theme System - Smart River Watch

Beautiful, nature-friendly theme system with comprehensive design tokens.

## Structure

```
theme/
├── colors.ts      # Color palette with nature-friendly colors
├── typography.ts  # Typography system with font sizes, weights, line heights
├── shadows.ts     # Shadow system for iOS and Android
├── gradients.ts   # Predefined gradient configurations
└── index.ts       # Central export file
```

## Color Palette

### Primary Colors
- **Primary Blue** (`#1E90FF`) - Main brand color, river/water theme
- **Deep Blue** (`#0057A7`) - Secondary brand color
- **Eco Green** (`#32CD32`) - Nature/environment theme
- **Warning Yellow** (`#FFCC00`) - Caution/warning theme
- **Alert Red** (`#FF3B30`) - Danger/alert theme

### Usage

```typescript
import { colors } from '@/theme';

// Using in React Native StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[500], // #1E90FF
  },
  text: {
    color: colors.text.primary.light,
  },
});

// Using with NativeWind (Tailwind)
<View className="bg-primary-500 text-white">
  <Text className="text-eco-green-500">Nature-friendly text</Text>
</View>
```

## Typography

```typescript
import { typography } from '@/theme';

// Using predefined text styles
const styles = StyleSheet.create({
  heading: typography.textStyles.h1,
  body: typography.textStyles.body,
  button: typography.textStyles.button,
});

// Using with NativeWind
<Text className="text-3xl font-bold leading-tight">
  Heading Text
</Text>
```

## Shadows

```typescript
import { shadows } from '@/theme';

const styles = StyleSheet.create({
  card: shadows.md, // Medium shadow
  elevated: shadows.lg, // Large shadow
  colored: shadows.colored.primary, // Colored shadow
});
```

## Gradients

```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/theme';

<LinearGradient
  colors={gradients.primary.default.colors}
  start={gradients.primary.default.start}
  end={gradients.primary.default.end}
  style={styles.container}
>
  {/* Content */}
</LinearGradient>
```

## Tailwind Presets

All colors, spacing, and font sizes are available as Tailwind classes:

### Colors
- `bg-primary-500` - Primary blue background
- `text-eco-green-500` - Eco green text
- `border-warning-500` - Warning yellow border
- `bg-alert-500` - Alert red background

### Spacing
- `p-4` - Padding 16px
- `m-6` - Margin 24px
- `gap-3` - Gap 12px

### Typography
- `text-xs` - 12px
- `text-base` - 16px
- `text-2xl` - 24px
- `font-bold` - Bold weight
- `leading-tight` - Tight line height

## Examples

### Card Component
```tsx
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, gradients } from '@/theme';

export function Card() {
  return (
    <View style={[styles.card, shadows.md]}>
      <LinearGradient
        colors={gradients.primary.default.colors}
        start={gradients.primary.default.start}
        end={gradients.primary.default.end}
        style={styles.gradient}
      >
        <Text style={styles.title}>Smart River Watch</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.inverse.light,
  },
});
```

### Using NativeWind
```tsx
<View className="bg-primary-500 p-6 rounded-lg shadow-md">
  <Text className="text-white text-2xl font-bold">
    Water Quality Monitor
  </Text>
  <Text className="text-primary-100 text-base mt-2">
    Real-time data from sensors
  </Text>
</View>
```

## Color Meanings

- **Primary Blue** - Water, river, main actions
- **Deep Blue** - Depth, stability, trust
- **Eco Green** - Nature, success, healthy status
- **Warning Yellow** - Caution, attention needed
- **Alert Red** - Danger, critical issues, errors

## Best Practices

1. Use semantic color names (`success`, `error`, `warning`) for status indicators
2. Use color scales (50-900) for consistent theming
3. Use predefined gradients for visual consistency
4. Use Tailwind classes for rapid development
5. Use StyleSheet for complex or dynamic styles

