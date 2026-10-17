import { useState, useMemo } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useExpenses } from '../store/expenses-context';
import { useDebounce } from '../hooks/useDebounce';
import { useAppTheme } from '../store/theme-context';

function TodasDespesas() {
  const { expenses } = useExpenses();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const { colors } = useAppTheme();

  const filtered = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return expenses;
    return expenses.filter((e) =>
      e.description.toLowerCase().includes(term)
    );
  }, [expenses, debouncedQuery]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <TextInput
        style={[
          styles.search,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Buscar despesa..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
      />
      <DespesaSaida despesas={filtered} periodo="Total" />
    </View>
  );
}

export default TodasDespesas;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  search: {
    marginHorizontal: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 15,
  },
});
