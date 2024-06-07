import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { getCartData } from '../components/retriveCartData';

const CartScreen = () => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchCartData = async () => {
            const cartData = await getCartData();
            setCart(cartData);
            calculateTotalPrice(cartData);
        };

        fetchCartData();
    }, []);

    const calculateTotalPrice = (cart) => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const handleIncrement = async (productId) => {
        const updatedCart = cart.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        setCart(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const handleDecrement = async (productId) => {
        const updatedCart = cart.map(item => {
            if (item.id === productId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });

        setCart(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const renderCartItem = ({ item }) => (
        <View>
            <Text>{item.name}</Text>
            <Text>Price: ${item.price}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Button title="+" onPress={() => handleIncrement(item.id)} />
            <Button title="-" onPress={() => handleDecrement(item.id)} />
        </View>
    );

    return (
        <View>
            <FlatList
                data={cart}
                keyExtractor={item => item.id.toString()}
                renderItem={renderCartItem}
            />
            <Text>Total Price: ${totalPrice}</Text>
        </View>
    );
};

export default CartScreen;
