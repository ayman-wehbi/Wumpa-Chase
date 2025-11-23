import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, Button, Chip, Text, useTheme } from 'react-native-paper';

interface DifficultyModalProps {
  visible: boolean;
  currentDifficulty?: number;
  onConfirm: (difficulty: number) => void;
  onDismiss: () => void;
}

/**
 * Modal for selecting difficulty rating (1-10 scale)
 */
export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  visible,
  currentDifficulty,
  onConfirm,
  onDismiss,
}) => {
  const theme = useTheme();
  const [selectedDifficulty, setSelectedDifficulty] = useState(currentDifficulty);
  const row1 = [1, 2, 3, 4, 5];
  const row2 = [6, 7, 8, 9, 10];

  // Update local state when currentDifficulty changes
  useEffect(() => {
    setSelectedDifficulty(currentDifficulty);
  }, [currentDifficulty]);

  const handleConfirm = () => {
    if (selectedDifficulty) {
      onConfirm(selectedDifficulty);
    }
    onDismiss();
  };

  const handleCancel = () => {
    // Reset to original value
    setSelectedDifficulty(currentDifficulty);
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleCancel}>
        <Dialog.Title>Set Difficulty</Dialog.Title>
        <Dialog.Content>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            Select difficulty rating (1-10)
          </Text>
          <View style={styles.container}>
            <View style={styles.chipRow}>
              {row1.map((rating) => (
                <Chip
                  key={rating}
                  mode={selectedDifficulty === rating ? 'flat' : 'outlined'}
                  selected={selectedDifficulty === rating}
                  onPress={() => setSelectedDifficulty(rating)}
                  style={styles.chip}
                  compact
                >
                  {rating}
                </Chip>
              ))}
            </View>
            <View style={styles.chipRow}>
              {row2.map((rating) => (
                <Chip
                  key={rating}
                  mode={selectedDifficulty === rating ? 'flat' : 'outlined'}
                  selected={selectedDifficulty === rating}
                  onPress={() => setSelectedDifficulty(rating)}
                  style={styles.chip}
                  compact
                >
                  {rating}
                </Chip>
              ))}
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>Cancel</Button>
          <Button onPress={handleConfirm} disabled={!selectedDifficulty}>
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  chip: {
    height: 32,
    minWidth: 36,
  },
});
