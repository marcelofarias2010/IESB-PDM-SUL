import { Alert, Button, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { scheduleReminder } from '../../services/notifications';
import { useTasks } from '../../store/tasks-context';
import { styles } from '../../styles/shared';

/**
 * Detalhe de uma tarefa a partir do id da URL.
 */
export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const { tasks, toggleDone, deleteTask } = useTasks();
  const task = tasks.find((item) => item.id === String(id));

  if (!task) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Tarefa não encontrada</Text>
        <Text style={styles.body}>
          O id {id} não existe na lista (ou ainda está carregando).
        </Text>
        <View style={styles.buttonWrap}>
          <Button title="Voltar" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  /**
   * Marca a tarefa como concluída com feedback tátil.
   */
  async function handleComplete() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (!task.done) toggleDone(task.id);
    Alert.alert('Tarefa concluída', task.title);
  }

  /**
   * Agenda lembrete local com o título da tarefa.
   */
  async function handleReminder() {
    await scheduleReminder(task.title, 10);
    Alert.alert('Lembrete', 'Notificação agendada para daqui a 10 s.');
  }

  /**
   * Confirma e remove a tarefa.
   */
  function handleDelete() {
    Alert.alert('Excluir tarefa', `Remover "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.subtitle}>Id da rota: {task.id}</Text>
      {task.description ? (
        <Text style={styles.body}>{task.description}</Text>
      ) : (
        <Text style={styles.body}>Sem descrição.</Text>
      )}
      {task.done ? <Text style={styles.doneBadge}>Concluída</Text> : null}

      <View style={styles.buttonWrap}>
        <Button title="Concluir" onPress={handleComplete} />
      </View>
      <View style={styles.buttonWrap}>
        <Button title="Lembrar em 10 s" onPress={handleReminder} />
      </View>
      <View style={styles.buttonWrap}>
        <Button title="Excluir" color="#E31E24" onPress={handleDelete} />
      </View>
      <View style={styles.buttonWrap}>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    </View>
  );
}
