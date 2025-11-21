import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  date?: string; // ISO date string
  label?: string;
  onChange: (date: string) => void;
}

/**
 * Date picker component that shows a tappable date chip
 * Opens native date picker when tapped
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  date,
  label = 'Completed',
  onChange,
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (isoDate: string): string => {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, hide picker on any event
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    // If user selected a date (not cancelled)
    if (selectedDate) {
      onChange(selectedDate.toISOString());
      // On iOS, hide picker after selection
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (Platform.OS === 'ios') {
      // iOS cancel button pressed
      setShowPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.label}>
        {label}:
      </Text>
      {date ? (
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Chip
            mode="flat"
            compact
            icon="calendar-edit"
            textStyle={styles.chipText}
          >
            {formatDate(date)}
          </Chip>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text
            variant="bodySmall"
            style={[styles.notCompleted, { color: theme.colors.outline }]}
          >
            Tap to set date
          </Text>
        </TouchableOpacity>
      )}

      {showPicker && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
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
