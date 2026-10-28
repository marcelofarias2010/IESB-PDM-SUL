import { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { DoneIcon } from '../../components/DoneIcon';
import { getCurrentPlace } from '../../services/location';
import { scheduleReminder } from '../../services/notifications';
import { useTasks } from '../../store/tasks-context';
import { colors } from '../../constants/theme';
import { styles } from '../../styles/shared';

/**
 * Aba Tarefas: lista persistida, rotas e recursos nativos.
 */
export default function TasksScreen() {
  const { tasks, toggleDone, isLoaded } = useTasks();
  const [label, setLabel] = useState('Sem check-in');

  /**
   * Obtém a localização e atualiza o rótulo do check-in.
   */
  async function handleCheckIn() {
    const place = await getCurrentPlace();
    if (!place) {
      Alert.alert(
        'Sem localização',
        'Permissão negada ou GPS indisponível no emulador. Defina a posição em Extended controls › Location.'
      );
      return;
    }
    setLabel(place.label || 'Local encontrado');
  }

  /**
   * Agenda um lembrete local em 10 segundos.
   */
  async function handleReminder(title = 'Estudar') {
    await scheduleReminder(title, 10);
    Alert.alert('Lembrete', `Notificação de "${title}" em 10 s.`);
  }

  /**
   * Confirma a conclusão com vibração de sucesso.
   */
  async function handleComplete(task) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (task) {
      toggleDone(task.id);
      Alert.alert('Tarefa concluída', task.title);
      return;
    }
    Alert.alert('Tarefa concluída');
  }

  /**
   * Renderiza um card de tarefa na lista.
   */
  function renderTask({ item }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/task/${item.id}`)}
      >
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.description ? (
              <Text numberOfLines={2} style={styles.body}>
                {item.description}
              </Text>
            ) : null}
            {item.done ? (
              <Text style={styles.doneBadge}>Concluída</Text>
            ) : null}
          </View>
          <DoneIcon onPress={() => handleComplete(item)}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={32}
              color={colors.primary}
            />
          </DoneIcon>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Tarefas</Text>
      <Text style={styles.subtitle}>
        Context API + Expo Router + recursos nativos
      </Text>

      <Link href="/new-task" style={styles.link}>
        + Nova tarefa
      </Link>

      <View style={styles.buttonWrap}>
        <Button title="Estudei aqui" onPress={handleCheckIn} />
      </View>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.buttonWrap}>
        <Button
          title="Lembrar em 10 s"
          onPress={() => handleReminder(tasks[0]?.title ?? 'Estudar')}
        />
      </View>

      <FlatList
        style={{ marginTop: 12 }}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={
          <Text style={styles.body}>
            {isLoaded
              ? 'Nenhuma tarefa. Toque em + Nova tarefa.'
              : 'Carregando tarefas...'}
          </Text>
        }
      />
    </View>
  );
}
