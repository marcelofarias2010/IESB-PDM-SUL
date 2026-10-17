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
import { useState, useLayoutEffect, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useExpenses } from '../store/expenses-context';

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
  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId;
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const selected = expenses.find((e) => e.id === expenseId);

  const [form, setForm] = useState({
    description: selected?.description ?? '',
    amount: selected ? String(selected.amount) : '',
    date: selected?.date ?? new Date(),
    category: selected?.category ?? '',
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
    if (!selected) return;
    setForm({
      description: selected.description ?? '',
      amount: String(selected.amount ?? ''),
      date:
        selected.date instanceof Date
          ? selected.date
          : new Date(selected.date),
      category: selected.category ?? '',
    });
  }, [selected]);

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
   * Valida e salva (criação ou edição).
   */
  function handleSubmit() {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const amount = Number(String(form.amount).replace(',', '.'));
    const data = { ...form, amount };

    if (isEditing) {
      updateExpense(expenseId, data);
    } else {
      addExpense(data);
    }
    navigation.goBack();
  }

  /**
   * Pede confirmação antes de excluir a despesa.
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
          onPress: () => {
            deleteExpense(expenseId);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, errors.description && styles.inputError]}
            maxLength={40}
            value={form.description}
            onChangeText={(text) => handleChange('description', text)}
          />
          {!!errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={[styles.input, errors.amount && styles.inputError]}
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
          <Text style={styles.label}>Data</Text>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[styles.input, errors.date && styles.inputError]}
          >
            <Text>{form.date.toLocaleDateString('pt-BR')}</Text>
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
          <Text style={styles.label}>Categoria</Text>
          <Pressable
            onPress={() => setIsPickerOpen(true)}
            style={[styles.input, errors.category && styles.inputError]}
          >
            <Text>{form.category || 'Escolha a categoria'}</Text>
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
          <View style={styles.sheet}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                onPress={() => selectCategory(category)}
                style={styles.option}
              >
                <Text style={styles.optionText}>{category}</Text>
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
