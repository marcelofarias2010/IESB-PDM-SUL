import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

function ItemMeta({ meta, onDelete, onToggle }) {
  return (
    <View style={styles.item}>
      <Pressable
        accessibilityLabel={`Marcar ${meta.texto} como ${meta.concluida ? 'pendente' : 'concluída'}`}
        android_ripple={{ color: '#DCE2FF', borderless: true }}
        onPress={() => onToggle(meta.id)}
        style={({ pressed }) => [styles.metaArea, pressed && styles.pressed]}
      >
        <View style={[styles.check, meta.concluida && styles.checkDone]}>
          <Text style={styles.checkText}>{meta.concluida ? '✓' : ''}</Text>
        </View>
        <View style={styles.itemTextArea}>
          <Text style={[styles.metaText, meta.concluida && styles.metaConcluida]}>
            {meta.texto}
          </Text>
          <Text style={styles.date}>Criada em {formatarData(meta.criadaEm)}</Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityLabel={`Remover meta ${meta.texto}`}
        android_ripple={{ color: '#FFD6D6', borderless: true }}
        hitSlop={8}
        onPress={() => onDelete(meta.id)}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
      >
        <Text style={styles.deleteText}>Remover</Text>
      </Pressable>
    </View>
  );
}

export default function MetaList({ metas, onDelete, onToggle, carregando }) {
  return (
    <FlatList
      contentContainerStyle={metas.length === 0 ? styles.emptyList : styles.list}
      data={metas}
      keyExtractor={(meta) => meta.id}
      renderItem={({ item }) => (
        <ItemMeta meta={item} onDelete={onDelete} onToggle={onToggle} />
      )}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            {carregando ? 'Carregando suas metas...' : 'Nenhuma meta por aqui'}
          </Text>
          {!carregando && (
            <Text style={styles.emptyText}>
              Adicione uma meta de estudo para começar o semestre com foco.
            </Text>
          )}
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyTitle: {
    color: '#394563',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#74809A',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  item: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E8F0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaArea: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 8,
  },
  check: {
    alignItems: 'center',
    borderColor: '#8A96B2',
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginRight: 12,
    width: 20,
  },
  checkDone: {
    backgroundColor: '#2E9D70',
    borderColor: '#2E9D70',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  itemTextArea: {
    flex: 1,
  },
  metaText: {
    color: '#202B49',
    fontSize: 16,
    fontWeight: '600',
  },
  metaConcluida: {
    color: '#7A849A',
    textDecorationLine: 'line-through',
  },
  date: {
    color: '#7A849A',
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  deleteText: {
    color: '#D13B46',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.65,
  },
});
