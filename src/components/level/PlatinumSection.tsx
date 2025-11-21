import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Text, useTheme, Divider, Card } from 'react-native-paper';
import { PlatinumTimeTrial } from '../../types';
import { AttemptCounter } from '../common/AttemptCounter';
import { DatePicker } from '../common/DatePicker';
import { TimePicker } from '../common/TimePicker';
import { DifficultyRating } from '../common/DifficultyRating';

interface PlatinumSectionProps {
  platinum: PlatinumTimeTrial;
  levelId: string;
  onCompletionChange: (levelId: string, completed: boolean) => void;
  onTimeChange: (levelId: string, time: string) => void;
  onAttemptsChange: (levelId: string, increment: boolean) => void;
  onDifficultyChange: (levelId: string, difficulty: number) => void;
  onDateChange: (levelId: string, date: string) => void;
}

export const PlatinumSection: React.FC<PlatinumSectionProps> = ({
  platinum,
  levelId,
  onCompletionChange,
  onTimeChange,
  onAttemptsChange,
  onDifficultyChange,
  onDateChange,
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <Text
            variant="titleSmall"
            style={[styles.title, { color: theme.colors.secondary }]}
          >
            Platinum Time Trial
          </Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.content}>
          <Checkbox.Item
            label="Completed"
            status={platinum.completed ? 'checked' : 'unchecked'}
            onPress={() => onCompletionChange(levelId, !platinum.completed)}
            labelStyle={styles.checkboxLabel}
            mode="android"
            position="leading"
          />

          {platinum.completed && (
            <>
              <TimePicker
                time={platinum.time}
                onTimeChange={time => onTimeChange(levelId, time)}
              />
              <DatePicker
                date={platinum.completionDate}
                onChange={date => onDateChange(levelId, date)}
              />
            </>
          )}

          <AttemptCounter
            attempts={platinum.attempts}
            onIncrement={() => onAttemptsChange(levelId, true)}
            onDecrement={() => onAttemptsChange(levelId, false)}
          />

          <DifficultyRating
            value={platinum.difficulty}
            onChange={difficulty => onDifficultyChange(levelId, difficulty)}
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
