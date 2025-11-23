import React, { useState, useEffect } from 'react';
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
  TextInput,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PlatinumTimeTrial } from '../../types';
import { AttemptCounter } from '../common/AttemptCounter';
import { DifficultyModal } from '../common/DifficultyModal';
import { NoteModal } from '../common/NoteModal';

interface PlatinumSectionProps {
  platinum: PlatinumTimeTrial;
  levelId: string;
  onCompletionChange: (levelId: string, completed: boolean) => void;
  onTimeChange: (levelId: string, time: string) => void;
  onAttemptsChange: (levelId: string, increment: boolean) => void;
  onDifficultyChange: (levelId: string, difficulty: number) => void;
  onDateChange: (levelId: string, date: string) => void;
  onNoteChange: (levelId: string, note: string) => void;
  onNoteDelete: (levelId: string) => void;
  onReset: (levelId: string) => void;
}

export const PlatinumSection: React.FC<PlatinumSectionProps> = ({
  platinum,
  levelId,
  onCompletionChange,
  onTimeChange,
  onAttemptsChange,
  onDifficultyChange,
  onDateChange,
  onNoteChange,
  onNoteDelete,
  onReset,
}) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Time input state
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [milliseconds, setMilliseconds] = useState('');

  const openMenu = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    // Force menu to remount on next open by changing key
    setMenuKey(prev => prev + 1);
  };

  const handleSetDifficulty = () => {
    closeMenu();
    setShowDifficultyModal(true);
  };

  // Parse time when modal opens
  useEffect(() => {
    if (showTimeModal && platinum.time) {
      const parts = platinum.time.split(':');
      if (parts.length === 2) {
        const [min, secAndMs] = parts;
        const secParts = secAndMs.split('.');
        setMinutes(min || '');
        setSeconds(secParts[0] || '');
        setMilliseconds(secParts[1] || '');
      }
    } else if (showTimeModal && !platinum.time) {
      setMinutes('');
      setSeconds('');
      setMilliseconds('');
    }
  }, [showTimeModal, platinum.time]);

  const handleSetTime = () => {
    closeMenu();
    setShowTimeModal(true);
  };

  const handleTimeConfirm = () => {
    const min = minutes.padStart(2, '0');
    const sec = seconds.padStart(2, '0');
    const ms = milliseconds.padStart(3, '0');
    const formattedTime = `${min}:${sec}.${ms}`;
    onTimeChange(levelId, formattedTime);
    setShowTimeModal(false);
  };

  const handleTimeCancel = () => {
    setShowTimeModal(false);
  };

  const handleTimeClear = () => {
    onTimeChange(levelId, '');
    setShowTimeModal(false);
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

  const formatDate = (dateString?: string, compact = false) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (compact) {
      // Short numeric format: "1/1/25"
      return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
    }
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
          <View style={styles.titleRow}>
            <Checkbox
              status={platinum.completed ? 'checked' : 'unchecked'}
              onPress={() => onCompletionChange(levelId, !platinum.completed)}
            />
            <Text
              variant="titleSmall"
              style={[styles.title, { color: theme.colors.secondary }]}
            >
              Platinum Time Trial
            </Text>
          </View>
          <View style={styles.headerActions}>
            {platinum.note && (
              <IconButton
                icon="information"
                size={20}
                onPress={() => setShowNoteView(true)}
                style={styles.infoIcon}
              />
            )}
            <View>
              <Menu
                key={menuKey}
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
                <Menu.Item onPress={handleSetTime} title="Set Time" leadingIcon="timer" />
                <Menu.Item
                  onPress={handleAddEditNote}
                  title={platinum.note ? 'Edit Note' : 'Add Note'}
                  leadingIcon="note-text"
                />
                <Divider />
                <Menu.Item onPress={handleReset} title="Reset" leadingIcon="restart" />
              </Menu>
            </View>
          </View>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.content}>
          <AttemptCounter
            attempts={platinum.attempts}
            onIncrement={() => onAttemptsChange(levelId, true)}
            onDecrement={() => onAttemptsChange(levelId, false)}
          />

          {/* Display current values as info chips */}
          {(platinum.difficulty || platinum.time || platinum.completionDate) && (
            <View style={[styles.infoRow, (() => {
              const badgeCount = [platinum.difficulty, platinum.time, platinum.completionDate].filter(Boolean).length;
              return badgeCount === 3 ? { gap: 2, paddingHorizontal: 0 } : {};
            })()]}>
              {(() => {
                const badgeCount = [platinum.difficulty, platinum.time, platinum.completionDate].filter(Boolean).length;
                const chipStyle = badgeCount >= 2
                  ? [styles.infoChip, { flex: 1, minWidth: 0, maxWidth: (badgeCount === 3 ? '33%' : '50%') as '33%' | '50%' }]
                  : styles.infoChip;

                return (
                  <>
                    {platinum.difficulty && (
                      <Chip
                        mode="flat"
                        icon="gauge"
                        style={chipStyle}
                        textStyle={styles.chipText}
                        compact
                      >
                        {badgeCount === 3 ? `Diff: ${platinum.difficulty}` : `Diff: ${platinum.difficulty}`}
                      </Chip>
                    )}
                    {platinum.time && (
                      <Chip
                        mode="flat"
                        icon="timer"
                        style={chipStyle}
                        textStyle={styles.chipText}
                        compact
                      >
                        {platinum.time}
                      </Chip>
                    )}
                    {platinum.completionDate && (
                      <Chip
                        mode="flat"
                        icon="calendar-check"
                        style={chipStyle}
                        textStyle={styles.chipText}
                        onPress={() => setShowDatePicker(true)}
                        compact
                      >
                        {formatDate(platinum.completionDate, badgeCount === 3)}
                      </Chip>
                    )}
                  </>
                );
              })()}
            </View>
          )}
        </View>
      </Card.Content>

      {/* Difficulty Modal */}
      <DifficultyModal
        visible={showDifficultyModal}
        currentDifficulty={platinum.difficulty}
        onConfirm={(difficulty) => onDifficultyChange(levelId, difficulty)}
        onDismiss={() => setShowDifficultyModal(false)}
      />

      {/* Time Modal */}
      <Portal>
        <Dialog visible={showTimeModal} onDismiss={handleTimeCancel}>
          <Dialog.Title>Set Best Time</Dialog.Title>
          <Dialog.Content>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Format: MM:SS.mmm
            </Text>
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
          </Dialog.Content>
          <Dialog.Actions>
            {platinum.time && <Button onPress={handleTimeClear}>Clear</Button>}
            <Button onPress={handleTimeCancel}>Cancel</Button>
            <Button onPress={handleTimeConfirm}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Note Modal */}
      <NoteModal
        visible={showNoteModal}
        currentNote={platinum.note}
        onSave={(note) => onNoteChange(levelId, note)}
        onDismiss={() => setShowNoteModal(false)}
      />

      {/* Note View Dialog */}
      <Portal>
        <Dialog visible={showNoteView} onDismiss={() => setShowNoteView(false)}>
          <Dialog.Title>Note</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{platinum.note}</Text>
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
          value={platinum.completionDate ? new Date(platinum.completionDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Reset Confirmation Dialog */}
      <Portal>
        <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
          <Dialog.Title>Reset Platinum Time Trial</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to reset all data for this platinum time trial? This action cannot be undone.
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    margin: 0,
  },
  infoIcon: {
    margin: 0,
  },
  divider: {
    marginBottom: 8,
  },
  content: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  infoChip: {
    height: 28,
  },
  chipText: {
    lineHeight: 18,
    marginVertical: 0,
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
