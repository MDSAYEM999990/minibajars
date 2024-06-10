import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const handleAddToCart = async (product) => {
    try {
        const storedCart = await AsyncStorage.getItem('cart');
        const cart = storedCart ? JSON.parse(storedCart) : [];
        
        const productIndex = cart.findIndex(item => item.id === product.id);
        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
            Alert.alert('Product quantity increased');
        } else {
            product.quantity = 1; // Add default quantity
            cart.push(product);
            Alert.alert('Product added to cart');
        }

        await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error adding product to cart:', error);
        Alert.alert('Error adding product to cart');
    }
};
