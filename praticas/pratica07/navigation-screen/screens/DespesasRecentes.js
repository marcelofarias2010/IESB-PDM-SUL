import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { useAppTheme } from '../store/theme-context';
import { db } from '../src/firebaseConnection';
import { AuthContext } from '../src/auth-contexto';
import { mapExpenseDocument } from '../src/mapExpense';

function DespesasRecentes() {
  const { uid } = useContext(AuthContext);
  const { colors } = useAppTheme();
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    if (!uid) return undefined;

    const unsubscribe = onSnapshot(collection(db, uid), (snapshot) => {
      setDespesas(snapshot.docs.map(mapExpenseDocument));
    });

    return () => unsubscribe();
  }, [uid]);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const recent = despesas.filter(
    (expense) => expense.date >= sevenDaysAgo && expense.date <= today
  );

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
