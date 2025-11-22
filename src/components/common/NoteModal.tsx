import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Button, TextInput } from 'react-native-paper';

interface NoteModalProps {
  visible: boolean;
  currentNote?: string;
  onSave: (note: string) => void;
  onDismiss: () => void;
}

/**
 * Modal for adding or editing notes
 */
export const NoteModal: React.FC<NoteModalProps> = ({
  visible,
  currentNote,
  onSave,
  onDismiss,
}) => {
  const [note, setNote] = useState(currentNote || '');

  // Update local state when currentNote changes
  useEffect(() => {
    setNote(currentNote || '');
  }, [currentNote]);

  const handleSave = () => {
    onSave(note.trim());
    onDismiss();
  };

  const handleCancel = () => {
    // Reset to original value
    setNote(currentNote || '');
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleCancel}>
        <Dialog.Title>{currentNote ? 'Edit Note' : 'Add Note'}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode="outlined"
            label="Note"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            placeholder="Enter your note here..."
            style={styles.textInput}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>Cancel</Button>
          <Button onPress={handleSave}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  textInput: {
    minHeight: 100,
  },
});
