import React, { useEffect, useState } from 'react';
import {  Text, FlatList,  StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import ProductFlatList from './components/ProductFlatList';
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
        <ProductFlatList
        displayedProducts={displayedProducts}
        setDisplayedProducts={setDisplayedProducts}
        setLoadingMore={setLoadingMore}
        setPage={setPage}
        page={page}
        pageSize={pageSize}
        loadingMore={loadingMore}
    />
    );
};

export default ProductList;
