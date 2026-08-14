import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { titulo } from './util';
import componente_sem_nome from './util';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{titulo}</Text>
      <Text style={{margin: 20}}>{componente_sem_nome}</Text>
      <Button title='Clique aqui...' />
      <StatusBar style="auto" />
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
  text: {
    margin: 30,
    color: 'red',
    fontSize: 22,
    fontWeight: 'bold'
  }
});
