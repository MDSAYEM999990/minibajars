import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { renderItem } from './components/renderItem'
import { handleLoadMore } from './components/handleMore';


const ProductList = () => {
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

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
    }, []); 

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <FlatList
            data={displayedProducts}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id.toString() + index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loadingMore && displayedProducts.length % 10 === 0 ? <ActivityIndicator size="large" color="#0000ff" /> : null}
        />
    );
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 1,
    },
   
});

export default ProductList;
