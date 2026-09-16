import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function MetaInput({ value, onChangeText, onAdd }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Nova meta</Text>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onAdd}
          placeholder="Ex.: Revisar useEffect"
          placeholderTextColor="#8992A8"
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable
          accessibilityLabel="Adicionar meta"
          android_ripple={{ color: '#B6C4FF', borderless: false }}
          onPress={onAdd}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>Adicionar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    color: '#394563',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#F1F3F9',
    borderColor: '#D9DEEA',
    borderRadius: 10,
    borderWidth: 1,
    color: '#192342',
    flex: 1,
    fontSize: 16,
    height: 48,
    paddingHorizontal: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#3F5EFB',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    marginLeft: 8,
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
