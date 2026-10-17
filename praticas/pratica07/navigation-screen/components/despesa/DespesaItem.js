import { Text, View, Pressable, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * Formata a data para dia/mês/ano.
 */
function getDataFormatada(data) {
  if (!(data instanceof Date) || isNaN(data.getTime())) {
    return '--/--/----';
  }
  return (
    data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear()
  );
}

function DespesaItem({ item }) {
  const navigation = useNavigation();

  /**
   * Abre a tela de edição desta despesa.
   */
  function handlePress() {
    navigation.navigate('GerenciarDespesa', { expenseId: item.id });
  }

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.itemContainer}>
        <View style={styles.itemText}>
          <Text>{getDataFormatada(item.date)}</Text>
        </View>
        <View style={styles.itemText}>
          <Text>{item.description}</Text>
          {!!item.category && (
            <Text style={styles.category}>{item.category}</Text>
          )}
        </View>
        <View style={styles.itemValor}>
          <Text>R$ {Number(item.amount).toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default DespesaItem;

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 4 },
    }),
  },
  itemText: {
    flex: 1,
    padding: 2,
    alignItems: 'flex-start',
  },
  itemValor: {
    flex: 1,
    padding: 2,
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
  },
});
