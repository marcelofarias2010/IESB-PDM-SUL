import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Button,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useContext, useState, useLayoutEffect, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAppTheme } from '../store/theme-context';
import { db } from '../src/firebaseConnection';
import { AuthContext } from '../src/auth-contexto';
import { toDate } from '../src/mapExpense';

const CATEGORIES = ['Alimentação', 'Transporte', 'Material', 'Outros'];

/**
 * Devolve a mensagem de erro de cada campo inválido.
 */
function validate(values) {
  const errors = {};
  const amount = Number(String(values.amount).replace(',', '.'));

  if (values.description.trim().length < 3) {
    errors.description = 'Mínimo de 3 caracteres';
  }
  if (isNaN(amount) || amount <= 0) {
    errors.amount = 'Informe um valor maior que zero';
  }
  if (values.date > new Date()) {
    errors.date = 'A data não pode ser futura';
  }
  if (!values.category) {
    errors.category = 'Escolha uma categoria';
  }

  return errors;
}

function GerenciarDespesas({ route, navigation }) {
  const { uid } = useContext(AuthContext);
  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId;
  const { colors } = useAppTheme();

  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: new Date(),
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar despesa' : 'Nova despesa',
    });
  }, [navigation, isEditing]);

  useEffect(() => {
    if (!expenseId || !uid) return undefined;

    /**
     * Carrega a despesa do Firestore para preencher o formulário de edição.
     */
    async function loadExpense() {
      const snapshot = await getDoc(doc(db, uid, expenseId));
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      setForm({
        description: data.description ?? '',
        amount: String(data.amount ?? ''),
        date: toDate(data.date),
        category: data.category ?? '',
      });
    }

    loadExpense();
    return undefined;
  }, [expenseId, uid]);

  /**
   * Atualiza um campo do formulário e limpa o erro desse campo.
   */
  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  /**
   * Restringe o valor a número com até 2 casas decimais.
   */
  function handleChangeAmount(text) {
    const cleanText = text.replace(',', '.');
    const match = cleanText.match(/^\d*\.?\d{0,2}$/);
    if (match) {
      handleChange('amount', cleanText);
    }
  }

  /**
   * Grava a data confirmada no calendário e fecha o seletor.
   */
  function onValueChange(event, selectedDate) {
    setShowPicker(false);
    if (selectedDate) {
      handleChange('date', selectedDate);
    }
  }

  /**
   * Fecha o calendário quando o usuário cancela.
   */
  function onDismiss() {
    setShowPicker(false);
  }

  /**
   * Grava a categoria escolhida e fecha o modal.
   */
  function selectCategory(category) {
    handleChange('category', category);
    setIsPickerOpen(false);
  }

  /**
   * Valida e salva a despesa no Firestore (criação ou edição).
   */
  async function handleSubmit() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = {
      description: form.description.trim(),
      amount: Number(String(form.amount).replace(',', '.')),
      date: form.date,
      category: form.category,
    };

    try {
      if (isEditing) {
        await updateDoc(doc(db, uid, expenseId), payload);
      } else {
        await addDoc(collection(db, uid), payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a despesa.');
    }
  }

  /**
   * Pede confirmação e remove a despesa do Firestore.
   */
  function confirmDelete() {
    Alert.alert(
      'Excluir despesa',
      'Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, uid, expenseId));
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a despesa.');
            }
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }, errors.description && styles.inputError]}
            maxLength={40}
            value={form.description}
            onChangeText={(text) => handleChange('description', text)}
          />
          {!!errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Valor (R$)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }, errors.amount && styles.inputError]}
            keyboardType="decimal-pad"
            maxLength={10}
            value={form.amount}
            onChangeText={handleChangeAmount}
          />
          {!!errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Data</Text>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }, errors.date && styles.inputError]}
          >
            <Text style={{ color: colors.text }}>{form.date.toLocaleDateString('pt-BR')}</Text>
          </Pressable>
          {!!errors.date && (
            <Text style={styles.errorText}>{errors.date}</Text>
          )}
          {showPicker && (
            <DateTimePicker
              value={form.date}
              mode="date"
              display="default"
              onValueChange={onValueChange}
              onDismiss={onDismiss}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Categoria</Text>
          <Pressable
            onPress={() => setIsPickerOpen(true)}
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }, errors.category && styles.inputError]}
          >
            <Text style={{ color: colors.text }}>{form.category || 'Escolha a categoria'}</Text>
          </Pressable>
          {!!errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <Button title="Salvar" onPress={handleSubmit} />
          {isEditing && (
            <View style={styles.deleteButton}>
              <Button
                title="Excluir"
                color="#E31E24"
                onPress={confirmDelete}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPickerOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { backgroundColor: colors.input }]}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                onPress={() => selectCategory(category)}
                style={styles.option}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>{category}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default GerenciarDespesas;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    minHeight: 40,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: '#E31E24',
    borderWidth: 2,
  },
  errorText: {
    color: '#E31E24',
    fontSize: 12,
    marginTop: 4,
  },
  buttons: {
    marginTop: 8,
    gap: 8,
  },
  deleteButton: {
    marginTop: 8,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
});
