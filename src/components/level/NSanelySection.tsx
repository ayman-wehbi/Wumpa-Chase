import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
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
  const [menuKey, setMenuKey] = useState(0);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Calculate badge count and layout
  const badgeInfo = useMemo(() => {
    const count = [nsanely.difficulty, nsanely.completionDate].filter(Boolean).length;

    // For 2 badges, make each badge wider (~45% width)
    // For 1 badge, use natural width
    const chipContainerStyle = count === 2
      ? { minWidth: '45%' as const }
      : {};

    return { count, chipContainerStyle };
  }, [nsanely.difficulty, nsanely.completionDate]);

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
              status={nsanely.completed ? 'checked' : 'unchecked'}
              onPress={() => onCompletionChange(levelId, !nsanely.completed)}
            />
            <Text
              variant="titleSmall"
              style={[styles.title, { color: theme.colors.tertiary }]}
            >
              N.Sanely Perfect Relic
            </Text>
          </View>
          <View style={styles.headerActions}>
            {nsanely.note && (
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
                <Menu.Item
                  onPress={handleAddEditNote}
                  title={nsanely.note ? 'Edit Note' : 'Add Note'}
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
            attempts={nsanely.attempts}
            onIncrement={() => onAttemptsChange(levelId, true)}
            onDecrement={() => onAttemptsChange(levelId, false)}
          />

          {/* Display current difficulty and date as info chips */}
          {badgeInfo.count > 0 && (
            <View style={styles.infoRow}>
              {nsanely.completionDate && (
                <Animated.View
                  style={[styles.chipContainer, badgeInfo.chipContainerStyle]}
                  entering={FadeIn.duration(300)}
                  exiting={FadeOut.duration(200)}
                  layout={LinearTransition.springify()}
                >
                  <Chip
                    key="completionDate"
                    mode="flat"
                    icon="calendar-check"
                    style={styles.infoChip}
                    textStyle={styles.chipText}
                    onPress={() => setShowDatePicker(true)}
                    compact
                  >
                    {formatDate(nsanely.completionDate, badgeInfo.count === 2)}
                  </Chip>
                </Animated.View>
              )}
              {nsanely.difficulty && (
                <Animated.View
                  style={[styles.chipContainer, badgeInfo.chipContainerStyle]}
                  entering={FadeIn.duration(300)}
                  exiting={FadeOut.duration(200)}
                  layout={LinearTransition.springify()}
                >
                  <Chip
                    key="difficulty"
                    mode="flat"
                    icon="gauge"
                    style={styles.infoChip}
                    textStyle={styles.chipText}
                    onPress={() => setShowDifficultyModal(true)}
                    compact
                  >
                    {badgeInfo.count === 2 ? `Diff: ${nsanely.difficulty}/10` : `Difficulty: ${nsanely.difficulty}/10`}
                  </Chip>
                </Animated.View>
              )}
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
    flexWrap: 'nowrap',
    marginTop: 12,
    marginBottom: 8,
  },
  infoChip: {
    height: 28,
  },
  chipContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    lineHeight: 18,
    marginVertical: 0,
  },
});
