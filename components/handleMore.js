import axios from 'axios';

export const handleLoadMore = (setDisplayedProducts, setLoadingMore, setPage, page, pageSize) => {
    return () => {
        setLoadingMore(true);
        const newPage = page + 1;
        axios.get(`https://fakestoreapi.com/products?limit=${pageSize}&page=${newPage}`)
            .then(response => {
                setDisplayedProducts(prevProducts => [...prevProducts, ...response.data]);
                setPage(newPage);
                setLoadingMore(false);
            })
            .catch(error => {
                Alert.alert('Error', 'Error fetching more products');
                setLoadingMore(false);
            });
    };
};
