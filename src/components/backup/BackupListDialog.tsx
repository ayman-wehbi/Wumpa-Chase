import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Dialog,
  Portal,
  Text,
  Button,
  List,
  Divider,
  ActivityIndicator,
  useTheme as usePaperTheme,
} from 'react-native-paper';
import { BackupFileInfo } from '../../types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  backupList: BackupFileInfo[];
  onSelectBackup: (filepath: string) => void;
  loading: boolean;
}

export const BackupListDialog: React.FC<Props> = ({
  visible,
  onDismiss,
  backupList,
  onSelectBackup,
  loading,
}) => {
  const paperTheme = usePaperTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Icon icon="backup-restore" />
        <Dialog.Title>Restore from Backup</Dialog.Title>
        <Dialog.Content>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={paperTheme.colors.primary}
              />
              <Text variant="bodyMedium" style={styles.loadingText}>
                Loading backups...
              </Text>
            </View>
          ) : backupList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text
                variant="bodyMedium"
                style={{ color: paperTheme.colors.onSurfaceVariant }}
              >
                No backups available yet.
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  color: paperTheme.colors.onSurfaceVariant,
                  marginTop: 8,
                }}
              >
                Backups are created automatically once per day when you open the
                app.
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollView}>
              {backupList.map((backup, index) => (
                <React.Fragment key={backup.filepath}>
                  <List.Item
                    title={backup.displayDate}
                    description={`${backup.metadata?.collectedGems || 0} / ${
                      backup.metadata?.totalGems || 456
                    } gems`}
                    left={props => <List.Icon {...props} icon="content-save" />}
                    onPress={() => onSelectBackup(backup.filepath)}
                    right={props => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                  />
                  {index < backupList.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </ScrollView>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  scrollView: {
    maxHeight: 300,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
});
