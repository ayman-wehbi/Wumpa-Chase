import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  RadioButton,
  Button,
  Dialog,
  Portal,
  Snackbar,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { useBackup } from '../hooks/useBackup';
import { BackupListDialog } from '../components/backup/BackupListDialog';
import { BackupPreview } from '../components/backup/BackupPreview';
import BackupService from '../services/BackupService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ThemeMode } from '../context/ThemeContext';

export const SettingsScreen: React.FC = () => {
  const paperTheme = usePaperTheme();
  const { themeMode, setThemeMode } = useTheme();
  const { resetAllProgress, loadProgressFromBackup } = useProgress();
  const [showResetDialog, setShowResetDialog] = useState(false);
    const insets = useSafeAreaInsets();

  // Backup state
  const {
    loading,
    backupList,
    refreshBackupList,
    exportBackup,
    restoreBackup,
    getBackupStats,
    getDownloadsBackupList,
  } = useBackup();

  const [showBackupList, setShowBackupList] = useState(false);
  const [showDownloadsList, setShowDownloadsList] = useState(false);
  const [downloadsBackupList, setDownloadsBackupList] = useState<any[]>([]);
  const [showBackupPreview, setShowBackupPreview] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [previewStats, setPreviewStats] = useState<any>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load backup list when dialog opens
  useEffect(() => {
    if (showBackupList) {
      refreshBackupList();
    }
  }, [showBackupList, refreshBackupList]);

  const handleThemeChange = (value: string) => {
    setThemeMode(value as ThemeMode);
  };

  const handleResetProgress = () => {
    resetAllProgress();
    setShowResetDialog(false);
  };

  // Handle export
  const handleExportBackup = async () => {
    const result = await exportBackup();
    if (result.success) {
      setSnackbarMessage('Backup exported successfully!');
      setSnackbarVisible(true);
    } else {
      setSnackbarMessage(`Export failed: ${result.error}`);
      setSnackbarVisible(true);
    }
  };

  // Handle import from Downloads
  const handleImportBackup = async () => {
    try {
      const downloadsList = await getDownloadsBackupList();
      setDownloadsBackupList(downloadsList);
      setShowDownloadsList(true);
    } catch (error) {
      setSnackbarMessage('Failed to access Downloads folder');
      setSnackbarVisible(true);
    }
  };

  // Handle backup selection
  const handleSelectBackup = async (filepath: string) => {
    setSelectedBackup(filepath);
    setShowBackupList(false);

    // Load and preview backup
    const backupData = await BackupService.loadBackup(filepath);
    if (backupData) {
      const stats = getBackupStats(backupData);
      setPreviewStats(stats);
      setShowBackupPreview(true);
    }
  };

  // Handle restore confirmation
  const handleRestoreConfirm = async () => {
    setShowBackupPreview(false);

    let result;
    if (selectedBackup) {
      // Restore from automatic backup
      result = await restoreBackup(selectedBackup);
    } else if (previewStats?.backupData) {
      // Restore from imported external file
      const { backupData } = previewStats;
      try {
        await loadProgressFromBackup(backupData.progress);
        setThemeMode(backupData.theme);
        result = { success: true };
      } catch (error) {
        result = { success: false, error: String(error) };
      }
    }

    if (result?.success) {
      setSnackbarMessage('Progress restored successfully!');
    } else {
      setSnackbarMessage(`Restore failed: ${result?.error}`);
    }
    setSnackbarVisible(true);
    setSelectedBackup(null);
    setPreviewStats(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background, paddingTop: insets.top }]}>


      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Appearance
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

            <Button
              mode="contained"
              onPress={handleExportBackup}
              icon="export"
              buttonColor={paperTheme.colors.primary}
              style={styles.backupButton}
              loading={loading}
              disabled={loading}
            >
              Export Backup
            </Button>

            <Button
              mode="outlined"
              onPress={() => setShowBackupList(true)}
              icon="backup-restore"
              style={styles.backupButton}
              disabled={loading}
            >
              Restore from Backup
            </Button>

            <Button
              mode="outlined"
              onPress={handleImportBackup}
              icon="file-upload"
              style={styles.backupButton}
              disabled={loading}
            >
              Import Backup File
            </Button>

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
              style={[styles.infoText, { color: paperTheme.colors.onSurfaceVariant }]}
            >
              Backups are created automatically once per day when app is opened.
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
                Wumpa Platter
              </Text>
            </View>

            <View style={styles.aboutRow}>
              <Text variant="bodyMedium" style={styles.aboutLabel}>
                Version
              </Text>
              <Text variant="bodyMedium" style={[styles.aboutValue, { color: paperTheme.colors.onSurfaceVariant }]}>
                1.1.2
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />

        <Text
          variant="bodyMedium"
          style={[
            styles.brandingText,
            { color: paperTheme.colors.onSurfaceVariant }
          ]}
        >
          Nico Works
        </Text>

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

      <BackupListDialog
        visible={showBackupList}
        onDismiss={() => setShowBackupList(false)}
        backupList={backupList}
        onSelectBackup={handleSelectBackup}
        loading={loading}
      />

      <BackupListDialog
        visible={showDownloadsList}
        onDismiss={() => setShowDownloadsList(false)}
        backupList={downloadsBackupList}
        onSelectBackup={handleSelectBackup}
        loading={loading}
      />

      <BackupPreview
        visible={showBackupPreview}
        onDismiss={() => {
          setShowBackupPreview(false);
          setSelectedBackup(null);
          setPreviewStats(null);
        }}
        onConfirm={handleRestoreConfirm}
        stats={previewStats}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
  backupButton: {
    marginTop: 12,
  },
  resetButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
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
  brandingText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});
