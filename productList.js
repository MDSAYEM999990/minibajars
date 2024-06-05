import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('https://fakestoreapi.com/products')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching products');
                setLoading(false);
            });
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image
                style={styles.image}
                source={{ uri: item.image }}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
        </View>
    );

    const handleAddToCart = async (product) => { 
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

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
        />
    );
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 1,
    },
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
        marginBottom: 10,
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

export default ProductList;
