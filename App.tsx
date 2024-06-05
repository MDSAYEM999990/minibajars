import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import ProductList from './productList';
const App = () => {
  return (
    <View>
     <ProductList/>
    </View>
  );
};
export default App;
