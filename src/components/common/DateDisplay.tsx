import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';

interface DateDisplayProps {
  date?: string; // ISO date string
  label?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  label = 'Completed',
}) => {
  const theme = useTheme();

  const formatDate = (isoDate: string): string => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.label}>
        {label}:
      </Text>
      {date ? (
        <Chip
          mode="flat"
          compact
          icon="calendar-check"
          textStyle={styles.chipText}
        >
          {formatDate(date)}
        </Chip>
      ) : (
        <Text
          variant="bodySmall"
          style={[styles.notCompleted, { color: theme.colors.outline }]}
        >
          Not completed
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  label: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 12,
  },
  notCompleted: {
    fontStyle: 'italic',
  },
});
