import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { rotulo_btn_cadastro_meta, rotulo_input_meta, rotulo_lista_metas } from './mensagens';
export default function App() {
  return (
    <View style={styles.mainConcainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
        <View style={{ width: '65%' }}>
          <TextInput style={styles.inputText} placeholder={rotulo_input_meta} />
        </View>
        <View style={{ width: '30%' }}>
          <Button title={rotulo_btn_cadastro_meta} />
        </View>
      </View>

      <View style={styles.metaContainer}>
        <Text>{rotulo_lista_metas}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainConcainer: {
    padding: 30,
    flex: 1,
    flexDirection: 'column'
  },
  inputText: {
    borderColor: "#cccccc",
    borderWidth: 1
  },
  metaContainer: {
    flex: 2
  }
});
