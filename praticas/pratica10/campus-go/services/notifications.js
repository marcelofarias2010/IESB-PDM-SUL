import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Garante canal Android e permissão de notificação.
 */
async function ensurePermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { granted } = await Notifications.requestPermissionsAsync();
  return granted;
}

/**
 * Agenda um lembrete local após alguns segundos.
 */
export async function scheduleReminder(title, seconds) {
  if (!(await ensurePermission())) return;

  const { TIME_INTERVAL } = Notifications.SchedulableTriggerInputTypes;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'CampusGo',
      body: `Não esqueça: ${title}`,
    },
    trigger: { type: TIME_INTERVAL, seconds },
  });
}
