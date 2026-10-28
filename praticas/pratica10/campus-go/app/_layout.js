import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpensesContextProvider } from '../store/expenses-context';
import { TasksContextProvider } from '../store/tasks-context';
import { colors } from '../constants/theme';

/**
 * Layout raiz: pilha principal do app.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ExpensesContextProvider>
        <TasksContextProvider>
          <Stack screenOptions={{ headerTintColor: colors.primary }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="task/[id]" options={{ title: 'Tarefa' }} />
            <Stack.Screen
              name="new-task"
              options={{ presentation: 'modal', title: 'Nova tarefa' }}
            />
          </Stack>
        </TasksContextProvider>
      </ExpensesContextProvider>
    </SafeAreaProvider>
  );
}
