import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCartData } from '../components/retriveCartData';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCartData = async () => {
            const cartData = await getCartData();
            setCart(cartData);
            calculateTotalPrice(cartData);
        };

        fetchCartData();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (            
                <TouchableOpacity onPress={handleDeleteAll} style={styles.headerButton}>
                    <Image source={require('../assets/delete.png')} style={styles.deleteImage} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const calculateTotalPrice = (cart) => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
        calculateDeliveryCharge(total);
    };

    const calculateDeliveryCharge = (total) => {
        let charge = 0;
        if (total < 1000) {
            charge = 20;
        } else if (total >= 1000 && total <= 2000) {
            charge = 15;
        } else if (total > 2000 && total <= 3000) {
            charge = 10;
        } else {
            charge = 0;
        }
        setDeliveryCharge(charge);
    };

    const handleIncrement = async (productId) => {
        const updatedCart = cart.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });

        setCart(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const handleDecrement = async (productId) => {
        const updatedCart = cart.map(item => {
            if (item.id === productId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });

        setCart(updatedCart);
        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const handleDelete = async (productId) => {
        Alert.alert(
            "Delete Item",
            " আপনি কি নিশ্চিত এই আইটেমটি মুছে ফেলতে চান ?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        const updatedCart = cart.filter(item => item.id !== productId);
                        setCart(updatedCart);
                        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
                        calculateTotalPrice(updatedCart);
                    }
                }
            ]
        );
    };

    const handleDeleteAll = async () => {
        Alert.alert(
            "Delete All Items",
            "আপনি কি সব আইটেম মুছে ফেলার বিষয়ে নিশ্চিত?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        setCart([]);
                        await AsyncStorage.setItem('cart', JSON.stringify([]));
                        setTotalPrice(0);
                        setDeliveryCharge(0);
                    }
                }
            ]
        );
    };

    const handleConfirmOrder = () => {
        Alert.alert(
            "Confirm Order",
            "আপনি কি অর্ডারটি নিশ্চিত করতে চান?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: () => {
                        // Add order confirmation logic here
                        // For example, navigate to a new screen or show a success message
                        Alert.alert("Order Confirmed", "Your order has been confirmed.");
                    }
                }
            ]
        );
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>Price: ৳ {item.price}</Text>
                <Text style={styles.quantity}>Qty :  {item.quantity}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.customButton}>
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.customButton}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Image source={require('../assets/delete.png')} style={styles.deleteImage} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                keyExtractor={item => item.id.toString()}
                renderItem={renderCartItem}
            />
            <View style={styles.totalContainer}>
                <View style={styles.priceDetails}>
                    <Text style={styles.totalPrice}>মোট : ৳{totalPrice}</Text>
                    <Text style={styles.deliveryCharge}>ডেলিভারি চার্জ : ৳{deliveryCharge}</Text>
                    <Text style={styles.finalTotal}>সর্বমোট: ৳{totalPrice + deliveryCharge}</Text>
                </View>
                <TouchableOpacity onPress={handleConfirmOrder} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Order Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
    itemInfo: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: 'green',
    },
    quantity: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 20,
    },
    customButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 10,
    },
    deleteImage: {
        width: 25,
        height: 25,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    priceDetails: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    deliveryCharge: {
        fontSize: 16,
        color: 'gray',
    },
    finalTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
    },
    headerButton: {
        marginRight: 20,
    },
    confirmButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#fff',
    },
});

export default CartScreen;
