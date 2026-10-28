import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

/**
 * Gera a função de ícone de cada aba.
 */
const tabIcon = (name) => ({ color, size }) => (
  <Ionicons name={name} color={color} size={size} />
);

/**
 * Layout das abas principais do CampusGo.
 */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: tabIcon('home') }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: 'Tarefas', tabBarIcon: tabIcon('checkbox') }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: 'Bolso', tabBarIcon: tabIcon('wallet') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: tabIcon('person') }}
      />
    </Tabs>
  );
}
