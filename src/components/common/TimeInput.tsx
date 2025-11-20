import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, IconButton, useTheme } from 'react-native-paper';

interface TimeInputProps {
  time?: string;
  onTimeChange: (time: string) => void;
  label?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  time = '',
  onTimeChange,
  label = 'Time (MM:SS.mmm)',
}) => {
  const theme = useTheme();
  const [localTime, setLocalTime] = useState(time);

  const handleTimeChange = (text: string) => {
    // Allow only numbers, colons, and periods
    const sanitized = text.replace(/[^0-9:.]/g, '');
    setLocalTime(sanitized);
  };

  const handleBlur = () => {
    onTimeChange(localTime);
  };

  const clearTime = () => {
    setLocalTime('');
    onTimeChange('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label={label}
        value={localTime}
        onChangeText={handleTimeChange}
        onBlur={handleBlur}
        placeholder="01:23.456"
        keyboardType="numbers-and-punctuation"
        dense
        style={styles.input}
        right={
          localTime ? (
            <TextInput.Icon icon="close-circle" onPress={clearTime} />
          ) : null
        }
      />
      <Text variant="labelSmall" style={[styles.hint, { color: theme.colors.outline }]}>
        Optional: Enter your best time
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  input: {
    fontSize: 14,
  },
  hint: {
    marginTop: 4,
    marginLeft: 12,
    fontStyle: 'italic',
  },
});
