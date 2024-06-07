import React from 'react';
import { FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { renderItem } from './renderItem';
import { handleLoadMore } from './handleMore';

const ProductFlatList = ({
    displayedProducts,
    setDisplayedProducts,
    setLoadingMore,
    setPage,
    page,
    pageSize,
    loadingMore,
    updateCartCount
}) => {
    return (
        <FlatList
            data={displayedProducts}
            renderItem={(props) => renderItem({ ...props, updateCartCount })}
            keyExtractor={(item, index) => item.id.toString() + index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onEndReached={() => handleLoadMore(setDisplayedProducts, setLoadingMore, setPage, page, pageSize)()}
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

export default ProductFlatList;
