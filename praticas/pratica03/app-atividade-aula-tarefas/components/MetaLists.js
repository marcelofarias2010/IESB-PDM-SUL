import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function MetaList(props) {

  return (
    <ScrollView>
      {props.array.map((meta) => {
        return (
        <View key={meta.id} style={styles.itemContainer}>
            <Pressable  
                onPress={() => props.onDeleteItem(meta.id)}
                android_ripple={{ color: '#eab308' }}
                style={({ pressed }) => [
                    styles.pressable,
                    pressed && styles.pressedItem // Feedback visual para iOS
                ]}
            >
            <Text style={{padding: 10}}>{meta.texto}</Text>

            </Pressable>
        </View>
        )
      }
        
      )}
    </ScrollView>
  );
};
export default MetaList;

const styles = StyleSheet.create({
  itemContainer: {
    margin: 8,      
    borderRadius: 6,
    overflow: 'hidden', // Tranca a animação do ripple nas bordas arredondadas
  },
  pressable: {
    backgroundColor: 'lightblue',
  },
  pressedItem: {
    backgroundColor: '#fde047', // Cor amarela que preenche todo o retângulo
  },
});