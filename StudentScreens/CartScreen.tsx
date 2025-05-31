// screens/CartScreen.tsx

import React,{useState,useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useCart } from '../context/CartContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/CartStyle';
import Toast from 'react-native-toast-message';
import { getDBConnection,getStudentBalanceById} from '../db-service';
import { getImageSource } from '../utils/getImageSource';

const BACKEND_URL = 'http://10.0.2.2:3000';
const CartScreen = ({route,navigation}:any) => {
  const {studentId} = route.params;
  const [currentCredit, setCurrentCredit] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const db = await getDBConnection();
      const balance = await getStudentBalanceById(db, studentId);
      setCurrentCredit(balance);
    };
    fetchBalance();
  });

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price as any);
    const quantity = parseInt(item.quantity as any);
    if (isNaN(price) || isNaN(quantity)) return sum;
    return sum + price * quantity;
  }, 0);

  const renderItem = ({ item }:any) => {
    const quantity = parseInt(item.quantity as any) || 0;

    return (
      <View style={styles.cartItem}>
        <Image source={getImageSource(item.image)} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>RM {parseFloat(item.price).toFixed(2)}</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
              <Ionicons name="remove-circle-outline" size={24} color="#DC7726" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
              <Ionicons name="add-circle-outline" size={24} color="#DC7726" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Toast.show({ type: 'info', text1: 'Your cart is empty' });
      return;
    }

    try {
      navigation.navigate('Payment', { cart: cart, total: total});
    } catch (error: any) {

    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart</Text>
      {cart.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 150 }}
          />
          <View style={styles.totalContainer}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={styles.totalText}>Credit: RM {currentCredit.toFixed(2)}</Text>
              <Text style={styles.totalText}>Total: RM {total.toFixed(2)}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={clearCart}
                style={[styles.button, { backgroundColor: '#ccc' }]}
              >
                <Text style={styles.buttonText}>Clear Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCheckout}
                style={[styles.button, { backgroundColor: '#DC7726' }]}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default CartScreen;
