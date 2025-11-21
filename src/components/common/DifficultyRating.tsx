import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';

interface DifficultyRatingProps {
  value?: number;
  onChange: (difficulty: number) => void;
}

/**
 * Difficulty rating component (1-10 scale)
 * Displays as clickable chips
 */
export const DifficultyRating: React.FC<DifficultyRatingProps> = ({
  value,
  onChange,
}) => {
  const theme = useTheme();
  const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View style={styles.container}>
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
        Difficulty
      </Text>
      <View style={styles.chipContainer}>
        {ratings.map((rating) => (
          <Chip
            key={rating}
            mode={value === rating ? 'flat' : 'outlined'}
            selected={value === rating}
            onPress={() => onChange(rating)}
            style={styles.chip}
            compact
          >
            {rating}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    height: 32,
    minWidth: 36,
  },
});
