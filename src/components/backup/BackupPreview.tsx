import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Dialog,
  Portal,
  Text,
  Button,
  Divider,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { BackupStats } from '../../types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  stats: BackupStats | null;
}

export const BackupPreview: React.FC<Props> = ({
  visible,
  onDismiss,
  onConfirm,
  stats,
}) => {
  const paperTheme = usePaperTheme();

  if (!stats) return null;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon="information" />
        <Dialog.Title>Backup Preview</Dialog.Title>
        <Dialog.Content>
          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Gems Collected
            </Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {stats.collectedGems} / {stats.totalGems}
            </Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Platinum Trials
            </Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {stats.platinumCount}
            </Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={styles.statLabel}>
              N.Sanely Perfect
            </Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {stats.nsanelyCount}
            </Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Completion
            </Text>
            <Text variant="bodyMedium" style={styles.statValue}>
              {stats.completionPercentage.toFixed(1)}%
            </Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.statRow}>
            <Text variant="bodyMedium" style={styles.statLabel}>
              Last Updated
            </Text>
            <Text variant="bodySmall" style={styles.statValue}>
              {new Date(stats.lastUpdated).toLocaleDateString()}
            </Text>
          </View>

          <Text
            variant="bodySmall"
            style={[styles.warningText, { color: paperTheme.colors.error }]}
          >
            This will replace your current progress with this backup.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            onPress={onConfirm}
            mode="contained"
            buttonColor={paperTheme.colors.primary}
          >
            Restore
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    fontWeight: '600',
  },
  statValue: {
    fontWeight: '400',
  },
  divider: {
    marginVertical: 4,
  },
  warningText: {
    marginTop: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
