import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

interface AttemptCounterProps {
  attempts: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label?: string;
}

export const AttemptCounter: React.FC<AttemptCounterProps> = ({
  attempts,
  onIncrement,
  onDecrement,
  label = 'Attempts',
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.label}>
        {label}
      </Text>
      <View style={styles.counterContainer}>
        <IconButton
          icon="minus-circle"
          size={24}
          onPress={onDecrement}
          disabled={attempts === 0}
          iconColor={theme.colors.primary}
        />
        <View style={[styles.countBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="titleMedium" style={styles.countText}>
            {attempts}
          </Text>
        </View>
        <IconButton
          icon="plus-circle"
          size={24}
          onPress={onIncrement}
          iconColor={theme.colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    flex: 1,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBox: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  countText: {
    fontWeight: '600',
  },
});
