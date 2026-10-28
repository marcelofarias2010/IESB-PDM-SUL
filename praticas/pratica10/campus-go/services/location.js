import * as Location from 'expo-location';

/**
 * Retorna coordenadas e endereço aproximado do usuário.
 */
export async function getCurrentPlace() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const [address] = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      label: address
        ? `${address.street ?? ''} - ${address.district ?? ''}`.trim()
        : 'Local desconhecido',
    };
  } catch (error) {
    console.log('getCurrentPlace falhou', error);
    return null;
  }
}
