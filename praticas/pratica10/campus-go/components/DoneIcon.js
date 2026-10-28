import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

/**
 * Aplica um bounce ao pressionar o ícone de conclusão.
 */
export function DoneIcon({ children, onPress }) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /**
   * Dispara a animação e a ação externa.
   */
  function bounce() {
    scale.value = withSequence(withSpring(1.3), withSpring(1));
    if (onPress) onPress();
  }

  return (
    <Pressable onPress={bounce}>
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}
