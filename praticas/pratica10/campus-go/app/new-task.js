import { useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useTasks } from '../store/tasks-context';
import { styles } from '../styles/shared';

/**
 * Devolve a mensagem de erro de cada campo inválido.
 */
function validate(values) {
  const errors = {};
  if (values.title.trim().length < 3) {
    errors.title = 'Mínimo de 3 caracteres';
  }
  if (values.description.trim().length > 0 && values.description.trim().length < 3) {
    errors.description = 'Mínimo de 3 caracteres ou deixe em branco';
  }
  return errors;
}

/**
 * Modal de nova tarefa com formulário e validação.
 */
export default function NewTaskScreen() {
  const { addTask } = useTasks();
  const [form, setForm] = useState({ title: '', description: '' });
  const [errors, setErrors] = useState({});

  /**
   * Atualiza um campo do formulário e limpa o erro desse campo.
   */
  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  /**
   * Valida e grava a tarefa no contexto.
   */
  function handleSave() {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      Alert.alert('Revise o formulário', 'Corrija os campos destacados.');
      return;
    }

    addTask({
      title: form.title.trim(),
      description: form.description.trim(),
    });
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.screen}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Text style={styles.title}>Nova tarefa</Text>
        <Text style={styles.subtitle}>
          Mesmo padrão da Aula 09: validação, contexto e persistência.
        </Text>

        <Text style={styles.fieldLabel}>Título</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={form.title}
          onChangeText={(text) => handleChange('title', text)}
          placeholder="Ex.: Lista de PDM"
          placeholderTextColor="#9CA3AF"
        />
        {errors.title ? (
          <Text style={styles.errorText}>{errors.title}</Text>
        ) : null}

        <Text style={styles.fieldLabel}>Descrição (opcional)</Text>
        <TextInput
          style={[
            styles.input,
            styles.inputMultiline,
            errors.description && styles.inputError,
          ]}
          value={form.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Detalhes da tarefa"
          placeholderTextColor="#9CA3AF"
          multiline
        />
        {errors.description ? (
          <Text style={styles.errorText}>{errors.description}</Text>
        ) : null}

        <View style={styles.buttonWrap}>
          <Button title="Salvar tarefa" onPress={handleSave} />
        </View>
        <View style={styles.buttonWrap}>
          <Button title="Cancelar" color="#6B7280" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
