import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCartData } from '../components/retriveCartData';
import { useNavigation } from '@react-navigation/native';

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
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
            <View style={styles.buttonContainer}>
                <Button title="+" onPress={() => handleIncrement(item.id)} />
                <Button title="-" onPress={() => handleDecrement(item.id)} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                keyExtractor={item => item.id.toString()}
                renderItem={renderCartItem}
            />
            <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: 'green',
    },
    quantity: {
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default CartScreen;
