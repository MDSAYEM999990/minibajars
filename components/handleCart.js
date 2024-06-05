// handleCart.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


export const handleAddToCart = async (product) => {
    try {
        const storedCart = await AsyncStorage.getItem('cart');
        const cart = storedCart ? JSON.parse(storedCart) : [];
        
        const productExists = cart.some(item => item.id === product.id);
        if (productExists) {
            Alert.alert('Product already in cart');
            return;
        }
        cart.push(product);
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
        Alert.alert('Product added to cart');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        Alert.alert('Error adding product to cart');
    }     
};
