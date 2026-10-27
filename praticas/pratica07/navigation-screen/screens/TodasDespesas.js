import { useState, useMemo, useContext, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useDebounce } from '../hooks/useDebounce';
import { useAppTheme } from '../store/theme-context';
import { db } from '../src/firebaseConnection';
import { AuthContext } from '../src/auth-contexto';
import { mapExpenseDocument } from '../src/mapExpense';

function TodasDespesas() {
  const { uid } = useContext(AuthContext);
  const [despesas, setDespesas] = useState([]);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { colors } = useAppTheme();

  const filtered = useMemo(() => {
    const term = debouncedQuery.trim().toLowerCase();
    if (!term) return despesas;
    return despesas.filter((expense) =>
      expense.description.toLowerCase().includes(term)
    );
  }, [despesas, debouncedQuery]);

  useEffect(() => {
    if (!uid) return undefined;

    const unsubscribe = onSnapshot(collection(db, uid), (snapshot) => {
      setDespesas(snapshot.docs.map(mapExpenseDocument));
    });

    return () => unsubscribe();
  }, [uid]);

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
