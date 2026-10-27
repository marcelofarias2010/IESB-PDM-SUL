import { StyleSheet, View } from 'react-native';
import DespesasRecentes from './screens/DespesasRecentes';
import GerenciarDespesas from './screens/GerenciarDespesa';
import TodasDespesas from './screens/TodasDespesas';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import IconButton from './components/IconButton';
import { useNavigation } from '@react-navigation/native';
import { ExpensesContextProvider } from './store/expenses-context';
import { ThemeProvider, useAppTheme } from './store/theme-context';
import AuthProvider from './src/auth-contexto';


export default function App() {
  return (
    <ThemeProvider>
      <ExpensesContextProvider>
        <RootNavigation />
      </ExpensesContextProvider>
    </ThemeProvider>
  );
}

function RootNavigation() {
  const { mode, colors } = useAppTheme();
  const navigationTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  const Tab = createBottomTabNavigator();

  function BottomTabScreen() {
    const navigation = useNavigation();
    const { mode: themeMode, colors: themeColors, toggleTheme } = useAppTheme();

    return (
      <Tab.Navigator
        screenOptions={{
          headerRight: () => (
            <View style={styles.headerActions}>
              <IconButton
                icon={themeMode === 'dark' ? 'sunny' : 'moon'}
                size={22}
                color={themeColors.text}
                onPress={toggleTheme}
              />
              <IconButton
                icon="add"
                size={24}
                color={themeColors.text}
                onPress={() => navigation.navigate('GerenciarDespesa')}
              />
            </View>
          ),
        }}
      >
        <Tab.Screen name='DespesasRecentes' component={DespesasRecentes}
          options={{
            tabBarIcon: ({ color, size }) => (<Ionicons name='hourglass' size={size} color={color} />),
            tabBarLabel: 'Recentes',
            title: 'Despesas Recentes',
            tabBarLabelStyle: { fontSize: 12 }
          }}

        />
        <Tab.Screen name='TodasDespesas' component={TodasDespesas}
          options={{
            tabBarIcon: ({ color, size }) => (<Ionicons name='wallet-outline' size={size} color={color} />),
            tabBarLabel: 'Todas',
            title: 'Todas as Despesas',
            tabBarLabelStyle: { fontSize: 12 }
          }}
        />
      </Tab.Navigator>
    );
  }

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer
      theme={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: colors.background,
          card: colors.input,
          text: colors.text,
          primary: colors.primary,
          border: colors.border,
        },
      }}
    >
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen name='Despesas' component={BottomTabScreen} options={{ headerShown: false }} />
          <Stack.Screen name='GerenciarDespesa' component={GerenciarDespesas} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
