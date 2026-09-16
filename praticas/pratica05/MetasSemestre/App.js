import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import MetaInput from './components/MetaInput';
import MetaList from './components/MetaList';

const STORAGE_KEY = '@metas_semestre';

export default function App() {
  const [texto, setTexto] = useState('');
  const [metas, setMetas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  // Carrega as metas uma única vez, quando o app é iniciado.
  useEffect(() => {
    async function carregarMetas() {
      try {
        const metasSalvas = await AsyncStorage.getItem(STORAGE_KEY);

        if (metasSalvas) {
          const metasConvertidas = JSON.parse(metasSalvas);
          setMetas(Array.isArray(metasConvertidas) ? metasConvertidas : []);
        }
      } catch (erro) {
        Alert.alert(
          'Não foi possível carregar',
          'Suas metas não puderam ser recuperadas agora. Você pode continuar usando o app.'
        );
      } finally {
        setCarregando(false);
        setDadosCarregados(true);
      }
    }

    carregarMetas();
  }, []);

  // Salva a lista sempre que ela muda, depois de terminar a carga inicial.
  useEffect(() => {
    if (!dadosCarregados) return;

    async function salvarMetas() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
      } catch (erro) {
        Alert.alert(
          'Não foi possível salvar',
          'A alteração foi feita nesta sessão, mas talvez não fique disponível ao reabrir o app.'
        );
      }
    }

    salvarMetas();
  }, [metas, dadosCarregados]);

  const adicionarMeta = () => {
    const textoLimpo = texto.trim();

    if (!textoLimpo) {
      Alert.alert('Meta vazia', 'Digite uma meta de estudo antes de adicionar.');
      return;
    }

    const novaMeta = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      texto: textoLimpo,
      criadaEm: new Date().toISOString(),
      concluida: false,
    };

    setMetas((metasAnteriores) => [novaMeta, ...metasAnteriores]);
    setTexto('');
  };

  const removerMeta = (id) => {
    setMetas((metasAnteriores) => metasAnteriores.filter((meta) => meta.id !== id));
  };

  const alternarConclusao = (id) => {
    setMetas((metasAnteriores) =>
      metasAnteriores.map((meta) =>
        meta.id === id ? { ...meta, concluida: !meta.concluida } : meta
      )
    );
  };

  const resumo = useMemo(() => {
    const concluidas = metas.filter((meta) => meta.concluida).length;
    return { concluidas, pendentes: metas.length - concluidas };
  }, [metas]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Image
            source={require('./assets/academic-header.png')}
            style={styles.headerImage}
            accessibilityLabel="Ilustração de materiais de estudo"
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>Metas do Semestre</Text>
            <Text style={styles.subtitle}>
              {resumo.pendentes} pendentes / {resumo.concluidas} concluídas
            </Text>
          </View>
        </View>

        <MetaInput value={texto} onChangeText={setTexto} onAdd={adicionarMeta} />

        <MetaList
          metas={metas}
          carregando={carregando}
          onDelete={removerMeta}
          onToggle={alternarConclusao}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E7EAF3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 20,
  },
  headerImage: {
    borderRadius: 16,
    height: 64,
    marginRight: 14,
    width: 64,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#192342',
    fontSize: 23,
    fontWeight: '700',
  },
  subtitle: {
    color: '#65708C',
    fontSize: 14,
    marginTop: 4,
  },
});
