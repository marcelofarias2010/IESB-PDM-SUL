import { Text, View, StyleSheet, useWindowDimensions } from 'react-native';

function DespesaSumario({ despesas, periodo }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const somaDespesas = despesas.reduce(
    (total, despesa) => total + Number(despesa.amount || 0),
    0
  );
  const quantidade = despesas.length;

  return (
    <View style={[styles.container, isTablet && styles.wide]}>
      <View>
        <Text style={[styles.texto, isTablet && styles.textoLarge]}>
          {periodo}
        </Text>
        <Text style={styles.quantidade}>
          {quantidade} {quantidade === 1 ? 'despesa' : 'despesas'}
        </Text>
      </View>
      <Text style={[styles.texto, isTablet && styles.textoLarge]}>
        R$ {somaDespesas.toFixed(2)}
      </Text>
    </View>
  );
}

export default DespesaSumario;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#bdbdbd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 4,
  },
  wide: {
    paddingVertical: 14,
    marginHorizontal: 16,
  },
  texto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoLarge: {
    fontSize: 22,
  },
  quantidade: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
});
