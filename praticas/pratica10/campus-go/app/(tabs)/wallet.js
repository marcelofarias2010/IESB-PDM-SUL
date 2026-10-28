import { Button, Share, Text, View } from 'react-native';
import { useExpenses } from '../../store/expenses-context';
import { styles } from '../../styles/shared';

/**
 * Compartilha o resumo de gastos do mês.
 */
async function shareSummary(total) {
  await Share.share({
    message: `Gastei R$ ${total.toFixed(2)} este mês.`,
  });
}

/**
 * Aba Bolso: total das despesas do contexto da Aula 09.
 */
export default function WalletScreen() {
  const { expenses, isLoaded } = useExpenses();
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Bolso</Text>
      <Text style={styles.subtitle}>
        Mesmo contexto de despesas da Aula 09
      </Text>
      <Text style={styles.total}>
        {isLoaded ? `R$ ${total.toFixed(2)}` : 'Carregando...'}
      </Text>
      <Text style={styles.body}>
        {expenses.length} despesa(s) registrada(s)
      </Text>
      <View style={styles.buttonWrap}>
        <Button
          title="Compartilhar resumo"
          onPress={() => shareSummary(total)}
        />
      </View>
    </View>
  );
}
