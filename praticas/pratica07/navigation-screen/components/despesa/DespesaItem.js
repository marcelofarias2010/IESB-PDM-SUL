import { Text, View, Pressable, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../store/theme-context';

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
  const { colors } = useAppTheme();

  /**
   * Abre a tela de edição desta despesa.
   */
  function handlePress() {
    navigation.navigate('GerenciarDespesa', { expenseId: item.id });
  }

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
        <View style={styles.itemText}>
          <Text style={{ color: colors.text }}>{getDataFormatada(item.date)}</Text>
        </View>
        <View style={styles.itemText}>
          <Text style={{ color: colors.text }}>{item.description}</Text>
          {!!item.category && (
            <Text style={[styles.category, { color: colors.primary }]}>{item.category}</Text>
          )}
        </View>
        <View style={styles.itemValor}>
          <Text style={{ color: colors.text }}>R$ {Number(item.amount).toFixed(2)}</Text>
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
