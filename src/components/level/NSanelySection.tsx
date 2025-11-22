import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Checkbox,
  Text,
  useTheme,
  Divider,
  Card,
  IconButton,
  Menu,
  Portal,
  Dialog,
  Button,
  Chip,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NSanelyPerfectRelic } from '../../types';
import { AttemptCounter } from '../common/AttemptCounter';
import { DifficultyModal } from '../common/DifficultyModal';
import { NoteModal } from '../common/NoteModal';

interface NSanelySectionProps {
  nsanely: NSanelyPerfectRelic;
  levelId: string;
  onCompletionChange: (levelId: string, completed: boolean) => void;
  onAttemptsChange: (levelId: string, increment: boolean) => void;
  onDifficultyChange: (levelId: string, difficulty: number) => void;
  onDateChange: (levelId: string, date: string) => void;
  onNoteChange: (levelId: string, note: string) => void;
  onNoteDelete: (levelId: string) => void;
  onReset: (levelId: string) => void;
}

export const NSanelySection: React.FC<NSanelySectionProps> = ({
  nsanely,
  levelId,
  onCompletionChange,
  onAttemptsChange,
  onDifficultyChange,
  onDateChange,
  onNoteChange,
  onNoteDelete,
  onReset,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSetDifficulty = () => {
    closeMenu();
    setShowDifficultyModal(true);
  };

  const handleAddEditNote = () => {
    closeMenu();
    setShowNoteModal(true);
  };

  const handleReset = () => {
    closeMenu();
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    onReset(levelId);
    setShowResetDialog(false);
  };

  const handleNoteDelete = () => {
    onNoteDelete(levelId);
    setShowNoteView(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, hide picker on any event
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    // If user selected a date (not cancelled)
    if (selectedDate) {
      onDateChange(levelId, selectedDate.toISOString());
      // On iOS, hide picker after selection
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    } else if (Platform.OS === 'ios') {
      // iOS cancel button pressed
      setShowDatePicker(false);
    }
  };

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <Text
            variant="titleSmall"
            style={[styles.title, { color: theme.colors.tertiary }]}
          >
            N.Sanely Perfect Relic
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={openMenu}
                style={styles.menuButton}
              />
            }
          >
            <Menu.Item onPress={handleSetDifficulty} title="Set Difficulty" leadingIcon="gauge" />
            <Menu.Item
              onPress={handleAddEditNote}
              title={nsanely.note ? 'Edit Note' : 'Add Note'}
              leadingIcon="note-text"
            />
            <Divider />
            <Menu.Item onPress={handleReset} title="Reset" leadingIcon="restart" />
          </Menu>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.content}>
          <View style={styles.checkboxRow}>
            {nsanely.note && (
              <IconButton
                icon="information"
                size={20}
                onPress={() => setShowNoteView(true)}
                style={styles.infoIcon}
              />
            )}
            <View style={{ flex: 1 }}>
              <Checkbox.Item
                label="Completed"
                status={nsanely.completed ? 'checked' : 'unchecked'}
                onPress={() => onCompletionChange(levelId, !nsanely.completed)}
                labelStyle={styles.checkboxLabel}
                mode="android"
                position="leading"
                style={styles.checkbox}
              />
            </View>
            {nsanely.completed && nsanely.completionDate && (
              <Chip
                mode="outlined"
                compact
                onPress={() => setShowDatePicker(true)}
                style={styles.dateChip}
              >
                {formatDate(nsanely.completionDate)}
              </Chip>
            )}
          </View>

          <AttemptCounter
            attempts={nsanely.attempts}
            onIncrement={() => onAttemptsChange(levelId, true)}
            onDecrement={() => onAttemptsChange(levelId, false)}
          />

          {/* Display current difficulty as info chip */}
          {nsanely.difficulty && (
            <View style={styles.infoRow}>
              <Chip mode="flat" compact icon="gauge" style={styles.infoChip}>
                Difficulty: {nsanely.difficulty}
              </Chip>
            </View>
          )}
        </View>
      </Card.Content>

      {/* Difficulty Modal */}
      <DifficultyModal
        visible={showDifficultyModal}
        currentDifficulty={nsanely.difficulty}
        onConfirm={(difficulty) => onDifficultyChange(levelId, difficulty)}
        onDismiss={() => setShowDifficultyModal(false)}
      />

      {/* Note Modal */}
      <NoteModal
        visible={showNoteModal}
        currentNote={nsanely.note}
        onSave={(note) => onNoteChange(levelId, note)}
        onDismiss={() => setShowNoteModal(false)}
      />

      {/* Note View Dialog */}
      <Portal>
        <Dialog visible={showNoteView} onDismiss={() => setShowNoteView(false)}>
          <Dialog.Title>Note</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{nsanely.note}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleNoteDelete}>Delete</Button>
            <Button onPress={() => {
              setShowNoteView(false);
              setShowNoteModal(true);
            }}>
              Edit
            </Button>
            <Button onPress={() => setShowNoteView(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={nsanely.completionDate ? new Date(nsanely.completionDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Reset Confirmation Dialog */}
      <Portal>
        <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
          <Dialog.Title>Reset N.Sanely Perfect Relic</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to reset all data for this N.Sanely Perfect Relic? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowResetDialog(false)}>Cancel</Button>
            <Button onPress={confirmReset} textColor={theme.colors.error}>
              Reset
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontWeight: '600',
  },
  menuButton: {
    margin: 0,
  },
  divider: {
    marginBottom: 8,
  },
  content: {
    gap: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    margin: 0,
  },
  checkbox: {
    paddingLeft: 0,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateChip: {
    height: 28,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  infoChip: {
    height: 28,
  },
});
