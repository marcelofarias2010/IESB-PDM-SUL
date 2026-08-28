import { Button, ScrollView, StyleSheet, Text, TextInput, View,Image } from 'react-native';
import { rotulo_btn_cadastro_meta, rotulo_input_meta, rotulo_lista_metas,rotulo_minhas_metas } from './mensagens';
import { useState } from 'react';
import MetaList from './components/MetaLists';
import MetaInput from './components/MetaInput';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  
  const [metas, setMetas] = useState([]);

  function adicionarMetaHandler(inputMeta) {
    // criar um objeto com id único e texto da meta
    const novaMeta = { id: Math.random().toString(), texto: inputMeta };
    setMetas([...metas, novaMeta]);
  }

  function deletarMetaHandler(id) {
    console.log('Removendo meta com id:', id);
    const novasMetas = metas.filter((meta) => meta.id !== id);
    setMetas(novasMetas);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topo}>
          <View style={styles.imageContainer}>
            <Image 
              source={require('./assets/favicon.png')} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerText}>{rotulo_minhas_metas}</Text>
          </View>
        </View>
        <View style={styles.mainConcainer}>
          
         <MetaInput onAddMeta={adicionarMetaHandler} />

          <View style={styles.metaContainer}>
            <MetaList array={metas} onDeleteItem={deletarMetaHandler} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  mainConcainer: {
    padding: 30,
    flex: 1,
    flexDirection: 'column'
  },
  metaContainer: {
    flex: 10
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  imageContainer: {
    alignItems: 'left',
    marginTop: 10,
    paddingLeft: 30
  },
  image: {
    width: 50,
    height: 50
  },
  topo:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10,
  },
});