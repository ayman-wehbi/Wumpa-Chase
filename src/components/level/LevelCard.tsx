import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { LevelData } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { LevelProgress } from './LevelProgress';
import { GemCheckboxes } from './GemCheckboxes';
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
    updateNSanelyCompletion,
    updateNSanelyAttempts,
  } = useProgress();

  const handleToggle = () => setExpanded(!expanded);

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
          <View style={styles.section}>
            <GemCheckboxes
              gems={level.progress.normalMode}
              mode="normalMode"
              levelId={level.id}
              onCheckboxChange={updateGemCheckbox}
            />
          </View>

          <View style={styles.section}>
            <GemCheckboxes
              gems={level.progress.nVertedMode}
              mode="nVertedMode"
              levelId={level.id}
              onCheckboxChange={updateGemCheckbox}
            />
          </View>

          <PlatinumSection
            platinum={level.progress.platinumTimeTrial}
            levelId={level.id}
            onCompletionChange={updatePlatinumCompletion}
            onTimeChange={updatePlatinumTime}
            onAttemptsChange={updatePlatinumAttempts}
          />

          <NSanelySection
            nsanely={level.progress.nsanelyPerfectRelic}
            levelId={level.id}
            onCompletionChange={updateNSanelyCompletion}
            onAttemptsChange={updateNSanelyAttempts}
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
  section: {
    marginBottom: 8,
  },
});
