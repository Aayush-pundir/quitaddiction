import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { niche } from '../../config/niche';
import { useUserStore } from '../../store/userStore';
import { useThemeStore } from '../../store/themeStore';
import { useTheme } from '../../hooks/useTheme';
import { signInWithEmail, signUpWithEmail } from '../../lib/supabase/auth';
import { radius, spacing, typography } from '../../config/theme';

export function SettingsScreen() {
  const { theme, mode } = useTheme();
  const quitDate = useUserStore((s) => s.quitDate);
  const setQuitDate = useUserStore((s) => s.setQuitDate);
  const notificationOptIn = useUserStore((s) => s.notificationOptIn);
  const setNotificationOptIn = useUserStore((s) => s.setNotificationOptIn);
  const isPremium = useUserStore((s) => s.isPremium);
  const themeOverride = useThemeStore((s) => s.override);
  const setThemeOverride = useThemeStore((s) => s.setOverride);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const quitDaysAgo = quitDate
    ? Math.floor((Date.now() - new Date(quitDate).getTime()) / 86_400_000)
    : 0;

  function adjustQuitDate(deltaDays: number) {
    const base = quitDate ? new Date(quitDate) : new Date();
    base.setDate(base.getDate() - deltaDays);
    setQuitDate(base.toISOString());
  }

  async function requestNotificationPermission() {
    // Stub: real push infra (Phase 2) will call Notifications.requestPermissionsAsync().
    setNotificationOptIn(!notificationOptIn);
    Alert.alert(
      notificationOptIn ? 'Notifications disabled' : 'Notifications enabled',
      'Push notification infrastructure is stubbed for this MVP.'
    );
  }

  async function handleAuth(kind: 'signIn' | 'signUp') {
    if (!email || !password) {
      setAuthMessage('Enter an email and password.');
      return;
    }
    const { error } = kind === 'signIn' ? await signInWithEmail(email, password) : await signUpWithEmail(email, password);
    setAuthMessage(error ? error.message : kind === 'signIn' ? 'Signed in.' : 'Check your email to confirm.');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg, marginBottom: spacing.md }]}>
          Settings
        </Text>

        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.bodyBold, { color: theme.text }]}>Quit date</Text>
          <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs }]}>
            {quitDate ? new Date(quitDate).toLocaleDateString() : 'Not set'} ({quitDaysAgo} day
            {quitDaysAgo === 1 ? '' : 's'} ago)
          </Text>
          <View style={styles.stepperRow}>
            <Button label="− 1 day" variant="secondary" onPress={() => adjustQuitDate(-1)} style={styles.stepperButton} />
            <Button label="+ 1 day" variant="secondary" onPress={() => adjustQuitDate(1)} style={styles.stepperButton} />
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.rowBetween}>
            <Text style={[typography.bodyBold, { color: theme.text }]}>Reminders & notifications</Text>
            <Switch value={notificationOptIn} onValueChange={requestNotificationPermission} />
          </View>
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: spacing.xs }]}>
            Push infrastructure is stubbed for this MVP; this just saves your preference.
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

        <Card>
          <Text style={[typography.bodyBold, { color: theme.text, marginBottom: spacing.sm }]}>Account</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry
            style={[styles.input, { color: theme.text, borderColor: theme.border, marginTop: spacing.sm }]}
          />
          {authMessage && (
            <Text style={[typography.caption, { color: theme.textMuted, marginTop: spacing.xs }]}>{authMessage}</Text>
          )}
          <View style={styles.authRow}>
            <Button label="Sign in" variant="secondary" onPress={() => handleAuth('signIn')} style={styles.stepperButton} />
            <Button label="Sign up" onPress={() => handleAuth('signUp')} style={styles.stepperButton} />
          </View>
          <Button label="Continue with Apple (coming soon)" variant="ghost" disabled onPress={() => {}} style={{ marginTop: spacing.sm }} />
          <Button label="Continue with Google (coming soon)" variant="ghost" disabled onPress={() => {}} style={{ marginTop: spacing.sm }} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xl },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepperRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  stepperButton: { flex: 1 },
  themeRow: { flexDirection: 'row', gap: spacing.sm },
  themeButton: { flex: 1 },
  input: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  authRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
