import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, Button, TextInput, Text, Chip, useTheme } from 'react-native-paper';

interface TimePickerProps {
  time?: string; // Format: MM:SS.mmm
  onTimeChange: (time: string) => void;
  label?: string;
}

/**
 * Time picker component with modal for MM:SS.mmm format
 * Shows current time as chip, opens modal with separate inputs for minutes/seconds/milliseconds
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  time,
  onTimeChange,
  label = 'Best Time',
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  // Parse existing time or use default values
  const parseTime = (timeStr?: string) => {
    if (!timeStr) return { minutes: '', seconds: '', milliseconds: '' };
    const parts = timeStr.split(':');
    if (parts.length !== 2) return { minutes: '', seconds: '', milliseconds: '' };

    const [min, secAndMs] = parts;
    const secParts = secAndMs.split('.');

    return {
      minutes: min || '',
      seconds: secParts[0] || '',
      milliseconds: secParts[1] || '',
    };
  };

  const { minutes: initialMin, seconds: initialSec, milliseconds: initialMs } = parseTime(time);

  const [minutes, setMinutes] = useState(initialMin);
  const [seconds, setSeconds] = useState(initialSec);
  const [milliseconds, setMilliseconds] = useState(initialMs);

  const handleConfirm = () => {
    const min = minutes.padStart(2, '0');
    const sec = seconds.padStart(2, '0');
    const ms = milliseconds.padStart(3, '0');
    const formattedTime = `${min}:${sec}.${ms}`;
    onTimeChange(formattedTime);
    setShowPicker(false);
  };

  const handleCancel = () => {
    // Reset to original values
    const parsed = parseTime(time);
    setMinutes(parsed.minutes);
    setSeconds(parsed.seconds);
    setMilliseconds(parsed.milliseconds);
    setShowPicker(false);
  };

  const handleClear = () => {
    setMinutes('');
    setSeconds('');
    setMilliseconds('');
    onTimeChange('');
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.label}>
        {label}:
      </Text>
      {time ? (
        <Chip
          mode="flat"
          compact
          icon="timer"
          onPress={() => setShowPicker(true)}
          textStyle={styles.chipText}
        >
          {time}
        </Chip>
      ) : (
        <Button mode="outlined" onPress={() => setShowPicker(true)} compact style={styles.button}>
          Set Time
        </Button>
      )}

      <Portal>
        <Dialog visible={showPicker} onDismiss={handleCancel}>
          <Dialog.Title>Enter Best Time</Dialog.Title>
          <Dialog.Content>
            <View style={styles.timeInputContainer}>
              <View style={styles.inputGroup}>
                <TextInput
                  mode="outlined"
                  label="Min"
                  value={minutes}
                  onChangeText={(text) => setMinutes(text.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  dense
                  style={styles.timeInput}
                  maxLength={2}
                />
                <Text variant="titleLarge" style={styles.separator}>:</Text>
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  mode="outlined"
                  label="Sec"
                  value={seconds}
                  onChangeText={(text) => setSeconds(text.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  dense
                  style={styles.timeInput}
                  maxLength={2}
                />
                <Text variant="titleLarge" style={styles.separator}>.</Text>
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  mode="outlined"
                  label="Ms"
                  value={milliseconds}
                  onChangeText={(text) => setMilliseconds(text.replace(/[^0-9]/g, '').slice(0, 3))}
                  keyboardType="number-pad"
                  dense
                  style={styles.msInput}
                  maxLength={3}
                />
              </View>
            </View>
            <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 8 }}>
              Format: MM:SS.mmm
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            {time && <Button onPress={handleClear}>Clear</Button>}
            <Button onPress={handleCancel}>Cancel</Button>
            <Button onPress={handleConfirm}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    fontFamily: 'monospace',
  },
  button: {
    height: 32,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    width: 60,
  },
  msInput: {
    width: 70,
  },
  separator: {
    marginHorizontal: 4,
  },
});
