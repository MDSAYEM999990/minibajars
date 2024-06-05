import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const storedCart = await AsyncStorage.getItem('cart');
                if (storedCart) {
                    setCart(JSON.parse(storedCart));
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, []);

    const handleRemoveFromCart = async (productId) => {
        try {
            const updatedCart = cart.filter(item => item.id !== productId);
            setCart(updatedCart);
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
            Alert.alert('Product removed from cart');
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image
                style={styles.image}
                source={{ uri: item.image }}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Button title="Remove" onPress={() => handleRemoveFromCart(item.id)} />
        </View>
    );

    return (
        <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    image: {
        width: 120,
        height: 150,
        marginBottom: 5,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
        textAlign: 'center',
    },
    price: {
        fontSize: 14,
        color: 'green',
        marginBottom: 10,
    },
});

export default CartScreen;
