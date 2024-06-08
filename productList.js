import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { Badge } from 'react-native-elements';
import ProductFlatList from './components/ProductFlatList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProductList = () => {
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [cartCount, setCartCount] = useState(0);
    const pageSize = 10;

const navigation = useNavigation();

    useEffect(() => {
        axios.get('https://fakestoreapi.com/products')
            .then(response => {
                setDisplayedProducts(response.data.slice(0, pageSize));
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching products');
                setLoading(false);
            });

        const fetchCartCount = async () => {
            try {
                const storedCart = await AsyncStorage.getItem('cart');
                const cart = storedCart ? JSON.parse(storedCart) : [];
                setCartCount(cart.length);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };

        fetchCartCount();
    }, []);

    const updateCartCount = async () => {
        try {
            const storedCart = await AsyncStorage.getItem('cart');
            const cart = storedCart ? JSON.parse(storedCart) : [];
            setCartCount(cart.length);
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
        <View style={styles.iconContainer}>

        <TouchableOpacity style={styles.cartButton} onPress={() => alert('Search pressed!')}>
                <Image source={require('./assets/search-icon.png')} style={{ width: 30, height: 35, marginRight: 2 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartButton} onPress={() =>navigation.navigate('Cart')}>
                <Image source={require('./assets/cart-icon.png')} style={{ width: 30, height: 35, marginLeft: 10 }} />
                {cartCount > 0 && (
                    <Badge
                        value={cartCount}
                        status="error"
                        containerStyle={styles.badgeContainer}
                    />
                )}
            </TouchableOpacity>
            
        </View>
        <ProductFlatList
            displayedProducts={displayedProducts}
            setDisplayedProducts={setDisplayedProducts}
            setLoadingMore={setLoadingMore}
            setPage={setPage}
            page={page}
            pageSize={pageSize}
            loadingMore={loadingMore}
            updateCartCount={updateCartCount}
        />
    </View>
    
    
    );
};
const styles = StyleSheet.create({
    container: {
       
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    cartButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        top: -4,
        right: -8,
    },
});


export default ProductList;
