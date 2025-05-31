import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';
import { getImageSource } from '../utils/getImageSource'; 
import { getDBConnection,getStudentBalanceById,updateStudentsCredit } from '../db-service';
import styles from '../styles/PaymentStyle';
import { io } from 'socket.io-client'; 

const SOCKET_URL = 'http://10.0.2.2:5001/orders';  
const socket = io(SOCKET_URL, { transports: ['websocket'] }); 

const PaymentScreen = ({ route, navigation }:any) => {
  const {studentId } = route.params;
  const { total = 0, cart = [] } = route.params || {};
  const { clearCart } = useCart();
  const [currentCredit, setCurrentCredit] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const db = await getDBConnection();
      const balance = await getStudentBalanceById(db, studentId);
      setCurrentCredit(balance);
    };
    fetchBalance();
  }, []);

  const handlePayment = async () => {
    if (currentCredit >= total) {
      const newBalance = parseFloat((currentCredit - total).toFixed(2));
      setCurrentCredit(newBalance);
      
      try {
        const db = await getDBConnection();
        await updateStudentsCredit(db, studentId.toString(), newBalance);
        const orderDate = new Date().toISOString();
        const newOrder = { studentId, items: cart, total: total, date: orderDate, status: 'Pending' };
        const existingOrders = await AsyncStorage.getItem('orderHistory');
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        const updatedOrders = [...orders, newOrder];
  
        await AsyncStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
        
        socket.emit('add_order', JSON.stringify(newOrder));
        clearCart();
        Alert.alert('Payment Successful', `You paid RM ${total.toFixed(2)} using your credit.`, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TabNavigator', { screen: 'Order' }), 
          }
        ]);
      } catch (error) {
        console.error('Error saving order history', error);
      }
    } else {
      Alert.alert('Insufficient Credit', 'You do not have enough credit to make this payment.');
    }
  };

  const renderItem = ({ item }:any) => {
    const quantity = parseInt(item.quantity) || 0; 

    return (
      <View style={styles.cartItem}>
        <Image source={getImageSource(item.image)} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>RM {parseFloat(item.price).toFixed(2)}</Text>
          <Text style={styles.quantity}>Quantity: {quantity}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Confirm Order</Text>
      <Text style={styles.subHeader}>Items:</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: RM {total.toFixed(2)}</Text>
        <Text style={styles.totalText}>Available Credit: RM {currentCredit.toFixed(2)}</Text>
        <TouchableOpacity onPress={handlePayment} style={styles.pay}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;