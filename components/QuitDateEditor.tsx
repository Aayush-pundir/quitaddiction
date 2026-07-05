import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Button } from './Button';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../config/theme';

interface QuitDateEditorProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function QuitDateEditor({ value, onChange }: QuitDateEditorProps) {
  const { theme } = useTheme();
  const [iosPickerVisible, setIosPickerVisible] = useState(false);

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      maximumDate: new Date(),
      onChange: (_event, selectedDate) => {
        if (!selectedDate) return;
        DateTimePickerAndroid.open({
          value: selectedDate,
          mode: 'time',
          onChange: (_timeEvent, selectedTime) => {
            if (!selectedTime) return;
            const merged = new Date(selectedDate);
            merged.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            onChange(merged);
          },
        });
      },
    });
  }

  if (Platform.OS === 'android') {
    return (
      <View>
        <Text style={[typography.body, { color: theme.text }]}>{value.toLocaleString()}</Text>
        <Button
          label="Change quit date & time"
          variant="secondary"
          onPress={openAndroidPicker}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <View>
        <Text style={[typography.body, { color: theme.text }]}>{value.toLocaleString()}</Text>
        <Button
          label={iosPickerVisible ? 'Done' : 'Change quit date & time'}
          variant="secondary"
          onPress={() => setIosPickerVisible((v) => !v)}
          style={{ marginTop: spacing.sm }}
        />
        {iosPickerVisible && (
          <DateTimePicker
            value={value}
            mode="datetime"
            display="spinner"
            maximumDate={new Date()}
            onChange={(_event, selectedDate) => {
              if (selectedDate) onChange(selectedDate);
            }}
          />
        )}
      </View>
    );
  }

  // Web (and any other unsupported platform) fallback: the native picker
  // renders nothing there, so give hour-level manual controls instead.
  function adjust(deltaMinutes: number) {
    onChange(new Date(value.getTime() + deltaMinutes * 60_000));
  }

  return (
    <View>
      <Text style={[typography.body, { color: theme.text }]}>{value.toLocaleString()}</Text>
      <View style={styles.webRow}>
        <Button label="− 1 day" variant="secondary" onPress={() => adjust(-24 * 60)} style={styles.webButton} />
        <Button label="− 1 hr" variant="secondary" onPress={() => adjust(-60)} style={styles.webButton} />
        <Button label="+ 1 hr" variant="secondary" onPress={() => adjust(60)} style={styles.webButton} />
      </View>
      <Button
        label="Set to now"
        variant="ghost"
        onPress={() => onChange(new Date())}
        style={{ marginTop: spacing.sm }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  webButton: { flex: 1 },
});
