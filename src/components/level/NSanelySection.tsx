import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Text, useTheme, Divider, Card } from 'react-native-paper';
import { NSanelyPerfectRelic } from '../../types';
import { AttemptCounter } from '../common/AttemptCounter';
import { DateDisplay } from '../common/DateDisplay';

interface NSanelySectionProps {
  nsanely: NSanelyPerfectRelic;
  levelId: string;
  onCompletionChange: (levelId: string, completed: boolean) => void;
  onAttemptsChange: (levelId: string, increment: boolean) => void;
}

export const NSanelySection: React.FC<NSanelySectionProps> = ({
  nsanely,
  levelId,
  onCompletionChange,
  onAttemptsChange,
}) => {
  const theme = useTheme();

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
        </View>
        <Divider style={styles.divider} />

        <View style={styles.content}>
          <Checkbox.Item
            label="Completed"
            status={nsanely.completed ? 'checked' : 'unchecked'}
            onPress={() => onCompletionChange(levelId, !nsanely.completed)}
            labelStyle={styles.checkboxLabel}
            mode="android"
            position="leading"
          />

          {nsanely.completed && (
            <DateDisplay date={nsanely.completionDate} />
          )}

          <AttemptCounter
            attempts={nsanely.attempts}
            onIncrement={() => onAttemptsChange(levelId, true)}
            onDecrement={() => onAttemptsChange(levelId, false)}
          />
        </View>
      </Card.Content>
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
    marginBottom: 4,
  },
  title: {
    fontWeight: '600',
  },
  divider: {
    marginBottom: 8,
  },
  content: {
    gap: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
