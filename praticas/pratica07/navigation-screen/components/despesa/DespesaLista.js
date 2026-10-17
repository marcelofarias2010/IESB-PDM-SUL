import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DespesaItem from './DespesaItem';

/**
 * Mensagem exibida quando a lista não tem itens.
 */
function EmptyList() {
  return (
    <View style={styles.empty}>
      <Ionicons name="receipt-outline" size={48} color="#888" />
      <Text style={styles.emptyTitle}>Nenhuma despesa por aqui</Text>
      <Text style={styles.emptyHint}>Toque em + para adicionar a primeira</Text>
    </View>
  );
}

function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      renderItem={({ item }) => <DespesaItem item={item} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={EmptyList}
    />
  );
}

export default DespesaLista;

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#444',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 4,
    color: '#888',
    textAlign: 'center',
  },
});
