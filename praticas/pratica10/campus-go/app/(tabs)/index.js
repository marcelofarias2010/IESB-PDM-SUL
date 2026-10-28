import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  View,
} from 'react-native';
import { FadeIn } from '../../components/FadeIn';
import { useNotices } from '../../hooks/useNotices';
import { styles } from '../../styles/shared';

/**
 * Cartão simples para um aviso.
 */
function NoticeCard({ notice }) {
  return (
    <FadeIn>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{notice.title}</Text>
        <Text numberOfLines={2} style={styles.body}>
          {notice.body}
        </Text>
      </View>
    </FadeIn>
  );
}

/**
 * Aba Início: mural de avisos da API.
 */
export default function HomeScreen() {
  const { notices, isLoading, error, reload } = useNotices();

  if (isLoading && notices.length === 0) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.body}>Não foi possível carregar: {error}</Text>
        <Button title="Tentar novamente" onPress={reload} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Avisos</Text>
      <FlatList
        data={notices}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NoticeCard notice={item} />}
        refreshing={isLoading}
        onRefresh={reload}
        ListEmptyComponent={<Text style={styles.body}>Nenhum aviso.</Text>}
      />
    </View>
  );
}
