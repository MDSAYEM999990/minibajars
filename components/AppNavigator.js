import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from '../productList';
import CartScreen from '../screen/cart';
//import SearchScreen from

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="ProductList"
                    component={ProductList}
                    options={{ title: 'Products' }}
                />
                <Stack.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{ title: 'Cart' }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
