import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { QuitDateEditor } from '../../components/QuitDateEditor';
import { niche } from '../../config/niche';
import { useUserStore } from '../../store/userStore';
import { useThemeStore } from '../../store/themeStore';
import { useTheme } from '../../hooks/useTheme';
import { signInWithEmail, signOut, signUpWithEmail, getAuthStatus, type AuthStatus } from '../../lib/supabase/auth';
import { radius, spacing, typography } from '../../config/theme';

export function SettingsScreen() {
  const { theme } = useTheme();
  const quitDate = useUserStore((s) => s.quitDate);
  const setQuitDate = useUserStore((s) => s.setQuitDate);
  const notificationOptIn = useUserStore((s) => s.notificationOptIn);
  const setNotificationOptIn = useUserStore((s) => s.setNotificationOptIn);
  const isPremium = useUserStore((s) => s.isPremium);
  const hardReset = useUserStore((s) => s.hardReset);
  const themeOverride = useThemeStore((s) => s.override);
  const setThemeOverride = useThemeStore((s) => s.setOverride);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [notificationBusy, setNotificationBusy] = useState(false);

  useEffect(() => {
    getAuthStatus().then(setAuthStatus);
  }, []);

  async function handleNotificationToggle(next: boolean) {
    setNotificationBusy(true);
    const granted = await setNotificationOptIn(next);
    setNotificationBusy(false);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (next && !granted) {
      Alert.alert(
        'Notifications unavailable',
        'This platform/device does not support local notifications, or permission was denied. Check your OS notification settings for this app.'
      );
    }
  }

  async function handleAuth(kind: 'signIn' | 'signUp') {
    if (!email || !password) {
      setAuthMessage('Enter an email and password.');
      return;
    }
    const { error } = kind === 'signIn' ? await signInWithEmail(email, password) : await signUpWithEmail(email, password);
    setAuthMessage(error ? error.message : kind === 'signIn' ? 'Signed in.' : 'Check your email to confirm.');
    if (!error) setAuthStatus(await getAuthStatus());
  }

  async function handleSignOut() {
    await signOut();
    setAuthStatus(await getAuthStatus());
    setAuthMessage('Signed out.');
  }

  function handleResetAllData() {
    Alert.alert(
      'Reset all local data',
      'This permanently deletes your quit date, streak history, relapse/urge logs, and read lessons from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: () => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            hardReset();
          },
        },
      ]
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg, marginBottom: spacing.md }]}>
          Settings
        </Text>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyBold, { color: theme.text, marginBottom: spacing.sm }]}>Quit date</Text>
          <QuitDateEditor
            value={quitDate ? new Date(quitDate) : new Date()}
            onChange={(date) => setQuitDate(date.toISOString())}
          />
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.rowBetween}>
            <Text style={[typography.bodyBold, { color: theme.text }]}>Reminders & notifications</Text>
            <Switch
              value={notificationOptIn}
              onValueChange={handleNotificationToggle}
              disabled={notificationBusy}
              accessibilityLabel="Toggle reminders and notifications"
            />
          </View>
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: spacing.xs }]}>
            Schedules on-device milestone celebrations and a daily reminder. Requires OS notification permission.
          </Text>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyBold, { color: theme.text, marginBottom: spacing.sm }]}>Appearance</Text>
          <View style={styles.themeRow}>
            {(['system', 'light', 'dark'] as const).map((option) => (
              <Button
                key={option}
                label={option[0].toUpperCase() + option.slice(1)}
                variant={themeOverride === option ? 'primary' : 'secondary'}
                onPress={() => setThemeOverride(option)}
                style={styles.themeButton}
              />
            ))}
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyBold, { color: theme.text }]}>Subscription</Text>
          <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs }]}>
            {isPremium ? `Active — ${niche.paywall.currencySymbol}${niche.paywall.annualPrice}/year` : 'No active subscription'}
          </Text>
          <Button
            label="Manage subscription"
            variant="ghost"
            onPress={() =>
              Alert.alert('Manage subscription', 'This opens the App Store / Play Store subscription management page in production.')
            }
            style={{ marginTop: spacing.sm }}
          />
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyBold, { color: theme.text, marginBottom: spacing.sm }]}>Account</Text>
          {authStatus?.signedIn && !authStatus.isAnonymous ? (
            <>
              <Text style={[typography.body, { color: theme.text }]}>Signed in as {authStatus.email}</Text>
              <Button label="Sign out" variant="secondary" onPress={handleSignOut} style={{ marginTop: spacing.sm }} />
            </>
          ) : (
            <>
              <Text style={[typography.caption, { color: theme.textMuted, marginBottom: spacing.sm }]}>
                {authStatus?.signedIn
                  ? 'Using an anonymous account. Add an email to keep your data if you switch devices.'
                  : "You're not signed in yet - your data stays on this device only. Add an email to back it up."}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                accessibilityLabel="Email"
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                accessibilityLabel="Password"
                style={[styles.input, { color: theme.text, borderColor: theme.border, marginTop: spacing.sm }]}
              />
              <View style={styles.authRow}>
                <Button label="Sign in" variant="secondary" onPress={() => handleAuth('signIn')} style={styles.stepperButton} />
                <Button label="Sign up" onPress={() => handleAuth('signUp')} style={styles.stepperButton} />
              </View>
              <Button label="Continue with Apple (coming soon)" variant="ghost" disabled onPress={() => {}} style={{ marginTop: spacing.sm }} />
              <Button label="Continue with Google (coming soon)" variant="ghost" disabled onPress={() => {}} style={{ marginTop: spacing.sm }} />
            </>
          )}
          {authMessage && (
            <Text style={[typography.caption, { color: theme.textMuted, marginTop: spacing.sm }]}>{authMessage}</Text>
          )}
        </Card>

        <Card>
          <Text style={[typography.bodyBold, { color: theme.danger }]}>Danger zone</Text>
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: spacing.xs, marginBottom: spacing.sm }]}>
            Permanently erase your quit date, streak history, and logs from this device.
          </Text>
          <Button label="Reset all local data" variant="ghost" onPress={handleResetAllData} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepperButton: { flex: 1 },
  themeRow: { flexDirection: 'row', gap: spacing.sm },
  themeButton: { flex: 1 },
  input: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  authRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
