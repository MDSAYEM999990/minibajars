import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { handleAddToCart } from './handleCart';


export const renderItem = ({ item }) => (
    <View style={styles.item}>
        <Image
            style={styles.image}
            source={{ uri: item.image }}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Button title="Add to Cart" color="red" onPress={() => handleAddToCart(item)} />
    </View>
);

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
        height: 120,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 12,
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
