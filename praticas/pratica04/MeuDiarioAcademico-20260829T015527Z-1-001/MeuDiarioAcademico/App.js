import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  ROTULO_BOTAO_ADICIONAR,
  ROTULO_INPUT_DISCIPLINA,
  ROTULO_LISTA_DISCIPLINAS,
  ROTULO_SWITCH_OBRIGATORIAS,
  TITULO_APP,
} from './labels';

const DISCIPLINAS_INICIAIS = [
  { id: '1', nome: 'Programação para Dispositivos Móveis' },
  { id: '2', nome: 'Engenharia de Software' },
  { id: '3', nome: 'Banco de Dados' },
];

export default function App() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [disciplinas, setDisciplinas] = useState(DISCIPLINAS_INICIAIS);
  const [mostrarObrigatorias, setMostrarObrigatorias] = useState(false);

  const nomeInformado = nomeDisciplina.trim().length > 0;

  function adicionarDisciplina() {
    const nome = nomeDisciplina.trim();

    if (!nome) {
      return;
    }

    setDisciplinas((disciplinasAtuais) => [
      ...disciplinasAtuais,
      { id: `${Date.now()}-${nome}`, nome },
    ]);
    setNomeDisciplina('');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <Text style={styles.eyebrow}>SEMESTRE ATUAL</Text>
          <Text style={styles.title}>{TITULO_APP}</Text>
          <Text style={styles.subtitle}>
            Organize as disciplinas que você está cursando.
          </Text>
        </View>

        <View style={styles.formRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              accessibilityLabel={ROTULO_INPUT_DISCIPLINA}
              onChangeText={setNomeDisciplina}
              onSubmitEditing={adicionarDisciplina}
              placeholder={ROTULO_INPUT_DISCIPLINA}
              placeholderTextColor="#7C879C"
              returnKeyType="done"
              style={styles.input}
              value={nomeDisciplina}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Pressable
              accessibilityRole="button"
              disabled={!nomeInformado}
              onPress={adicionarDisciplina}
              style={({ pressed }) => [
                styles.button,
                !nomeInformado && styles.buttonDisabled,
                pressed && nomeInformado && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>{ROTULO_BOTAO_ADICIONAR}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchLabel}>{ROTULO_SWITCH_OBRIGATORIAS}</Text>
            <Text style={styles.switchHint}>Filtro demonstrativo</Text>
          </View>
          <Switch
            accessibilityLabel={ROTULO_SWITCH_OBRIGATORIAS}
            onValueChange={setMostrarObrigatorias}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#C9D2E3', true: '#4A67D6' }}
            value={mostrarObrigatorias}
          />
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{ROTULO_LISTA_DISCIPLINAS}</Text>
            <Text style={styles.counter}>{disciplinas.length}</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {disciplinas.map((disciplina, index) => (
              <View key={disciplina.id} style={styles.item}>
                <View style={styles.itemNumber}>
                  <Text style={styles.itemNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.itemText}>{disciplina.nome}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F7FC',
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    marginBottom: 6,
    color: '#4A67D6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: '#17223B',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: '#68738A',
    fontSize: 15,
    lineHeight: 22,
  },
  formRow: {
    flexDirection: 'row',
    // Separa o input e o botão nas extremidades da mesma linha.
    justifyContent: 'space-between',
    // Mantém os dois controles alinhados verticalmente.
    alignItems: 'center',
    marginBottom: 16,
  },
  inputWrapper: {
    width: '70%',
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#C9D2E3',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    color: '#17223B',
    fontSize: 15,
  },
  buttonWrapper: {
    width: '27%',
  },
  button: {
    height: 50,
    // Centraliza o rótulo nas duas direções dentro do botão.
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#4A67D6',
  },
  buttonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: '#9DA9C7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#E9EDFA',
  },
  switchCopy: {
    flex: 1,
    paddingRight: 12,
  },
  switchLabel: {
    color: '#26334F',
    fontSize: 14,
    fontWeight: '600',
  },
  switchHint: {
    marginTop: 3,
    color: '#7C879C',
    fontSize: 12,
  },
  listSection: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    color: '#17223B',
    fontSize: 20,
    fontWeight: '700',
  },
  counter: {
    marginLeft: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#DDE4FF',
    color: '#3E57B7',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  itemNumber: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#EEF1FF',
  },
  itemNumberText: {
    color: '#4A67D6',
    fontSize: 13,
    fontWeight: '800',
  },
  itemText: {
    flex: 1,
    color: '#26334F',
    fontSize: 15,
    lineHeight: 21,
  },
});
