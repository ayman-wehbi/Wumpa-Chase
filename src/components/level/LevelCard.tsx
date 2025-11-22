import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme, Divider } from 'react-native-paper';
import { LevelData, GemCheckboxes } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { LevelProgress } from './LevelProgress';
import { GemRow } from './GemRow';
import { PlatinumSection } from './PlatinumSection';
import { NSanelySection } from './NSanelySection';

interface LevelCardProps {
  level: LevelData;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const {
    updateGemCheckbox,
    updatePlatinumCompletion,
    updatePlatinumTime,
    updatePlatinumAttempts,
    updatePlatinumDifficulty,
    updatePlatinumDate,
    updatePlatinumNote,
    deletePlatinumNote,
    resetPlatinum,
    updateNSanelyCompletion,
    updateNSanelyAttempts,
    updateNSanelyDifficulty,
    updateNSanelyDate,
    updateNSanelyNote,
    deleteNSanelyNote,
    resetNSanely,
  } = useProgress();

  const handleToggle = () => setExpanded(!expanded);

  const handleGemToggle = (mode: 'normalMode' | 'nVertedMode') => (gemType: keyof GemCheckboxes) => {
    const currentValue = level.progress[mode][gemType];
    updateGemCheckbox(level.id, mode, gemType, !currentValue);
  };

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Title
        title={level.name}
        titleVariant="titleMedium"
        subtitle={level.dimension}
        subtitleVariant="bodySmall"
        right={props => (
          <IconButton
            {...props}
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            onPress={handleToggle}
          />
        )}
      />

      <Card.Content>
        <LevelProgress progress={level.progress} />
      </Card.Content>

      {expanded && (
        <Card.Content style={styles.expandedContent}>
          <GemRow
            mode="Normal Mode"
            gems={level.progress.normalMode}
            onGemPress={handleGemToggle('normalMode')}
          />

          <Divider style={styles.divider} />

          <GemRow
            mode="N.Verted Mode"
            gems={level.progress.nVertedMode}
            onGemPress={handleGemToggle('nVertedMode')}
          />

          <Divider style={styles.divider} />

          <PlatinumSection
            platinum={level.progress.platinumTimeTrial}
            levelId={level.id}
            onCompletionChange={updatePlatinumCompletion}
            onTimeChange={updatePlatinumTime}
            onAttemptsChange={updatePlatinumAttempts}
            onDifficultyChange={updatePlatinumDifficulty}
            onDateChange={updatePlatinumDate}
            onNoteChange={updatePlatinumNote}
            onNoteDelete={deletePlatinumNote}
            onReset={resetPlatinum}
          />

          <NSanelySection
            nsanely={level.progress.nsanelyPerfectRelic}
            levelId={level.id}
            onCompletionChange={updateNSanelyCompletion}
            onAttemptsChange={updateNSanelyAttempts}
            onDifficultyChange={updateNSanelyDifficulty}
            onDateChange={updateNSanelyDate}
            onNoteChange={updateNSanelyNote}
            onNoteDelete={deleteNSanelyNote}
            onReset={resetNSanely}
          />
        </Card.Content>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  expandedContent: {
    paddingTop: 8,
  },
  divider: {
    marginVertical: 12,
  },
});
