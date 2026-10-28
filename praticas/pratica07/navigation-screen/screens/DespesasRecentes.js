import { View, StyleSheet } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';
import { useAppTheme } from '../store/theme-context';

function DespesasRecentes() {
  const { expenses } = useExpenses();
  const { colors } = useAppTheme();

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const recent = expenses.filter((e) => {
    const date = e.date instanceof Date ? e.date : new Date(e.date);
    return date >= sevenDaysAgo && date <= today;
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <DespesaSaida despesas={recent} periodo="Últimos 7 dias" />
    </View>
  );
}

export default DespesasRecentes;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
