import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCartData = async () => {
    try {
        const storedCart = await AsyncStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error('Error retrieving cart data:', error);
        return [];
    }
};
