import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Text, useTheme, Divider } from 'react-native-paper';
import { GemCheckboxes as GemCheckboxesType } from '../../types';

interface GemCheckboxesProps {
  gems: GemCheckboxesType;
  mode: 'normalMode' | 'nVertedMode';
  levelId: string;
  onCheckboxChange: (
    levelId: string,
    mode: 'normalMode' | 'nVertedMode',
    gemType: keyof GemCheckboxesType,
    value: boolean,
  ) => void;
}

interface GemItem {
  key: keyof GemCheckboxesType;
  label: string;
  icon?: string;
}

const GEM_ITEMS: GemItem[] = [
  { key: 'allBoxes', label: 'All Boxes', icon: 'checkbox-multiple-marked' },
  { key: 'wumpa80', label: '80% Wumpa Fruit', icon: 'fruit-cherries' },
  { key: 'deaths3OrLess', label: '≤3 Deaths', icon: 'heart' },
  { key: 'hiddenGem', label: 'Hidden Gem', icon: 'diamond-stone' },
  { key: 'nVertedAllBoxes', label: 'N.Verted All Boxes', icon: 'checkbox-multiple-marked-outline' },
  { key: 'nVertedHiddenGem', label: 'N.Verted Hidden Gem', icon: 'diamond' },
];

export const GemCheckboxes: React.FC<GemCheckboxesProps> = ({
  gems,
  mode,
  levelId,
  onCheckboxChange,
}) => {
  const theme = useTheme();

  const modeLabel = mode === 'normalMode' ? 'Normal Mode' : 'N.Verted Mode';

  return (
    <View style={styles.container}>
      <Text
        variant="titleSmall"
        style={[styles.modeTitle, { color: theme.colors.primary }]}
      >
        {modeLabel}
      </Text>
      <Divider style={styles.divider} />
      {GEM_ITEMS.map(item => (
        <View key={item.key} style={styles.checkboxRow}>
          <Checkbox.Item
            label={item.label}
            status={gems[item.key] ? 'checked' : 'unchecked'}
            onPress={() =>
              onCheckboxChange(levelId, mode, item.key, !gems[item.key])
            }
            labelStyle={styles.checkboxLabel}
            mode="android"
            position="leading"
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  modeTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  divider: {
    marginBottom: 8,
  },
  checkboxRow: {
    marginVertical: -4,
  },
  checkboxLabel: {
    fontSize: 14,
  },
});
