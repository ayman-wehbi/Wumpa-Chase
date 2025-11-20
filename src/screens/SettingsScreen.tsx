import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  RadioButton,
  Button,
  Dialog,
  Portal,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import type { ThemeMode } from '../context/ThemeContext';

export const SettingsScreen: React.FC = () => {
  const paperTheme = usePaperTheme();
  const { themeMode, setThemeMode } = useTheme();
  const { resetAllProgress } = useProgress();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleThemeChange = (value: string) => {
    setThemeMode(value as ThemeMode);
  };

  const handleResetProgress = () => {
    resetAllProgress();
    setShowResetDialog(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Appearance
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionDescription, { color: paperTheme.colors.onSurfaceVariant }]}
            >
              Choose your preferred theme
            </Text>

            <View style={styles.radioGroup}>
              <RadioButton.Group onValueChange={handleThemeChange} value={themeMode}>
                <View style={styles.radioItem}>
                  <RadioButton.Item
                    label="Light Mode"
                    value="light"
                    mode="android"
                    position="leading"
                  />
                </View>
                <View style={styles.radioItem}>
                  <RadioButton.Item
                    label="Dark Mode"
                    value="dark"
                    mode="android"
                    position="leading"
                  />
                </View>
                <View style={styles.radioItem}>
                  <RadioButton.Item
                    label="Auto (Follow System)"
                    value="auto"
                    mode="android"
                    position="leading"
                  />
                </View>
              </RadioButton.Group>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Data
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.sectionDescription, { color: paperTheme.colors.onSurfaceVariant }]}
            >
              Manage your progress data
            </Text>

            <Button
              mode="contained"
              onPress={() => setShowResetDialog(true)}
              icon="delete-forever"
              buttonColor={paperTheme.colors.error}
              textColor={paperTheme.colors.onError}
              style={styles.resetButton}
            >
              Reset All Progress
            </Button>

            <Text
              variant="bodySmall"
              style={[styles.warningText, { color: paperTheme.colors.error }]}
            >
              Warning: This will permanently delete all your tracked progress
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              About
            </Text>

            <View style={styles.aboutRow}>
              <Text variant="bodyMedium" style={styles.aboutLabel}>
                App Name
              </Text>
              <Text variant="bodyMedium" style={[styles.aboutValue, { color: paperTheme.colors.onSurfaceVariant }]}>
                Crash Bandicoot 4 Tracker
              </Text>
            </View>

            <View style={styles.aboutRow}>
              <Text variant="bodyMedium" style={styles.aboutLabel}>
                Version
              </Text>
              <Text variant="bodyMedium" style={[styles.aboutValue, { color: paperTheme.colors.onSurfaceVariant }]}>
                1.0.0
              </Text>
            </View>

            <View style={styles.aboutRow}>
              <Text variant="bodyMedium" style={styles.aboutLabel}>
                Total Levels
              </Text>
              <Text variant="bodyMedium" style={[styles.aboutValue, { color: paperTheme.colors.onSurfaceVariant }]}>
                38
              </Text>
            </View>

            <Text
              variant="bodySmall"
              style={[styles.aboutDescription, { color: paperTheme.colors.onSurfaceVariant }]}
            >
              Track your completion progress for all levels, gems, platinum time trials, and N.Sanely Perfect relics in Crash Bandicoot 4: It's About Time.
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <Portal>
        <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>Reset All Progress?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This will permanently delete all your tracked progress, including all gem
              checkboxes, platinum time trials, N.Sanely Perfect relics, and attempt counters.
            </Text>
            <Text variant="bodyMedium" style={styles.dialogWarning}>
              This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowResetDialog(false)}>Cancel</Button>
            <Button
              onPress={handleResetProgress}
              textColor={paperTheme.colors.error}
            >
              Reset
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
  },
  radioGroup: {
    marginTop: 8,
  },
  radioItem: {
    marginVertical: -4,
  },
  resetButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  warningText: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontWeight: '600',
  },
  aboutValue: {

  },
  aboutDescription: {
    marginTop: 16,
    lineHeight: 20,
  },
  dialogWarning: {
    marginTop: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 24,
  },
});
