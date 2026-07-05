import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { niche } from '../config/niche';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DAILY_REMINDER_IDENTIFIER = 'daily-reminder';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web' || !Device.isDevice) {
    // Local notifications aren't supported on web or simulators/emulators.
    return false;
  }
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function cancelAllScheduledNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (err) {
    console.warn('[notifications] cancelAll failed (non-fatal)', err);
  }
}

/** Schedules one notification per not-yet-reached milestone, fired the moment it's hit. */
export async function scheduleMilestoneNotifications(quitDate: Date) {
  const now = Date.now();
  for (const milestone of niche.milestones) {
    const fireAt = quitDate.getTime() + milestone.hours * 3_600_000;
    if (fireAt <= now) continue;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${milestone.icon} ${milestone.title} milestone reached!`,
          body: milestone.description,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(fireAt),
        },
      });
    } catch (err) {
      console.warn('[notifications] scheduleMilestoneNotifications failed (non-fatal)', err);
    }
  }
}

/** Schedules a recurring daily reminder at the given local hour (default 9am). */
export async function scheduleDailyReminder(hour = 9, minute = 0) {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_IDENTIFIER,
      content: {
        title: `Stay strong today`,
        body: `Remember your why. Every ${niche.streakNoun.replace(' streak', '')} hour counts.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (err) {
    console.warn('[notifications] scheduleDailyReminder failed (non-fatal)', err);
  }
}

/**
 * Cancels and reschedules all notifications for a new quit date; no-op if
 * disabled or unsupported. Returns whether notifications ended up active
 * (i.e. permission was granted), so callers can reflect the real OS state.
 */
export async function rescheduleAllNotifications(quitDate: Date, enabled: boolean): Promise<boolean> {
  await cancelAllScheduledNotifications();
  if (!enabled) return false;
  const granted = await requestNotificationPermission();
  if (!granted) return false;
  await scheduleMilestoneNotifications(quitDate);
  await scheduleDailyReminder();
  return true;
}
