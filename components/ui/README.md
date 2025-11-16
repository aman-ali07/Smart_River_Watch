# UI Components - Smart River Watch

Premium, modern UI components with glass/blur and gradient designs.

## Components

### 1. GlassCard
Blurred, translucent card with glassmorphism effect.

```tsx
import { GlassCard } from '@/components/ui';

<GlassCard intensity={80} tint="light" borderRadius={20}>
  <Text>Content here</Text>
</GlassCard>
```

**Props:**
- `children` - Content to display
- `intensity` - Blur intensity (default: 80)
- `tint` - 'light' | 'dark' (default: 'light')
- `borderRadius` - Border radius (default: 20)

---

### 2. GradientCard
Premium card with blue to green gradient.

```tsx
import { GradientCard } from '@/components/ui';

<GradientCard gradient="water" borderRadius={20}>
  <Text className="text-white text-xl font-bold">
    Water Quality Data
  </Text>
</GradientCard>
```

**Props:**
- `children` - Content to display
- `gradient` - 'default' | 'water' | 'nature' | 'primary' (default: 'water')
- `borderRadius` - Border radius (default: 20)

---

### 3. StatusChip
Status indicator chip with success/warning/danger variants.

```tsx
import { StatusChip } from '@/components/ui';

<StatusChip status="success" label="Excellent" showIcon size="md" />
<StatusChip status="warning" label="Fair" showIcon size="md" />
<StatusChip status="danger" label="Critical" showIcon size="md" />
```

**Props:**
- `status` - 'success' | 'warning' | 'danger' | 'info'
- `label` - Chip label text
- `showIcon` - Show icon (default: true)
- `size` - 'sm' | 'md' | 'lg' (default: 'md')

---

### 4. SectionHeader
Premium section header with optional icon and action.

```tsx
import { SectionHeader } from '@/components/ui';

<SectionHeader
  title="Water Quality"
  subtitle="Real-time monitoring"
  icon="water"
  actionLabel="View All"
  onActionPress={() => console.log('View all')}
/>
```

**Props:**
- `title` - Header title
- `subtitle` - Optional subtitle
- `icon` - Optional Ionicons icon name
- `actionLabel` - Optional action button label
- `onActionPress` - Action button callback
- `variant` - 'default' | 'gradient' (default: 'default')

---

### 5. PrimaryButton
Premium gradient button with soft shadow.

```tsx
import { PrimaryButton } from '@/components/ui';

<PrimaryButton
  title="Submit Report"
  onPress={() => console.log('Pressed')}
  variant="primary"
  size="md"
  icon="send"
  iconPosition="right"
  fullWidth
/>
```

**Props:**
- `title` - Button text
- `onPress` - Press handler
- `variant` - 'primary' | 'success' | 'warning' | 'danger' (default: 'primary')
- `size` - 'sm' | 'md' | 'lg' (default: 'md')
- `icon` - Optional Ionicons icon name
- `iconPosition` - 'left' | 'right' (default: 'left')
- `loading` - Show loading state
- `disabled` - Disable button
- `fullWidth` - Full width button

---

### 6. InputField
Premium input field with label and icon.

```tsx
import { InputField } from '@/components/ui';

<InputField
  label="Email Address"
  icon="mail"
  placeholder="Enter your email"
  variant="glass"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

**Props:**
- `label` - Input label
- `icon` - Optional Ionicons icon name
- `error` - Error message
- `helperText` - Helper text
- `rightIcon` - Optional right icon
- `onRightIconPress` - Right icon press handler
- `variant` - 'default' | 'glass' (default: 'default')
- All standard TextInput props

---

### 7. ChartContainer
Premium container for charts with glass/blur effect.

```tsx
import { ChartContainer } from '@/components/ui';
import { LineChart } from 'react-native-chart-kit';

<ChartContainer
  title="Water Quality Trends"
  subtitle="Last 7 days"
  icon="stats-chart"
  variant="glass"
  headerAction={<Button title="Export" />}
>
  <LineChart data={chartData} />
</ChartContainer>
```

**Props:**
- `title` - Container title
- `subtitle` - Optional subtitle
- `children` - Chart component
- `variant` - 'glass' | 'gradient' | 'default' (default: 'glass')
- `icon` - Optional Ionicons icon name
- `headerAction` - Optional header action component

---

### 8. MapPin
Premium map pin marker with status indicator.

```tsx
import { MapPin } from '@/components/ui';

<MapPin
  status="excellent"
  label="Sensor A"
  size="md"
  showPulse
/>
```

**Props:**
- `status` - 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | 'default'
- `label` - Optional pin label
- `size` - 'sm' | 'md' | 'lg' (default: 'md')
- `showPulse` - Show pulse animation

---

## Complete Example

```tsx
import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import {
  GlassCard,
  GradientCard,
  StatusChip,
  SectionHeader,
  PrimaryButton,
  InputField,
  ChartContainer,
} from '@/components/ui';

export default function ExampleScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Section Header */}
      <SectionHeader
        title="Dashboard"
        subtitle="Smart River Watch"
        icon="water"
        actionLabel="Settings"
        onActionPress={() => {}}
      />

      {/* Status Chips */}
      <View className="flex-row gap-2 mb-4">
        <StatusChip status="success" label="Excellent" />
        <StatusChip status="warning" label="Fair" />
        <StatusChip status="danger" label="Critical" />
      </View>

      {/* Glass Card */}
      <GlassCard className="mb-4 p-4">
        <Text className="text-lg font-bold mb-2">Glass Card</Text>
        <Text className="text-gray-600">
          This is a beautiful glass card with blur effect
        </Text>
      </GlassCard>

      {/* Gradient Card */}
      <GradientCard gradient="water" className="mb-4 p-6">
        <Text className="text-white text-xl font-bold mb-2">
          Water Quality
        </Text>
        <Text className="text-white/80">
          Real-time monitoring data
        </Text>
      </GradientCard>

      {/* Input Field */}
      <InputField
        label="Search Location"
        icon="search"
        placeholder="Enter location"
        variant="glass"
        className="mb-4"
      />

      {/* Chart Container */}
      <ChartContainer
        title="Quality Trends"
        icon="stats-chart"
        variant="glass"
        className="mb-4"
      >
        <Text>Chart content here</Text>
      </ChartContainer>

      {/* Primary Button */}
      <PrimaryButton
        title="Submit Report"
        onPress={() => {}}
        icon="send"
        iconPosition="right"
        fullWidth
      />
    </ScrollView>
  );
}
```

## Design Principles

- **Premium Feel**: Soft shadows, smooth gradients, glassmorphism
- **Modern UI**: Rounded corners, proper spacing, consistent typography
- **Nature-Friendly**: Blue and green color palette
- **Accessible**: Proper contrast, readable text sizes
- **Responsive**: Works on all screen sizes

## Styling

All components use the theme system from `@/theme`:
- Colors from `theme/colors.ts`
- Typography from `theme/typography.ts`
- Shadows from `theme/shadows.ts`
- Gradients from `theme/gradients.ts`

Components support both:
- **StyleSheet** props for custom styling
- **NativeWind/Tailwind** classes via `className` prop

