import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import styles from '../styles/HistoryStyle';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderNumber?: number;
  items: OrderItem[];
  total?: number;
  date?: string;
  status?: string;
}

var socket = io('http://10.0.2.2:5001/orders', {
  transports: ['websocket'] 
});

const HistoryScreen = ({ route }: any) => {
  const { studentId } = route.params;
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const navigation = useNavigation();
  
  useEffect(() => {
    socket.on('orders_list', (data: string) => {
      console.log('Updated orders received:', data);
      setOrderHistory(JSON.parse(data));  
    });
  
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Requesting orders from server...');
      socket.emit('get_orders', JSON.stringify({ studentId }));
    });
  
    return () => {
      unsubscribe();
      socket.off('orders_list');  
    };
  }, [navigation]);

  useEffect(() => {
    const fetchOrders = () => {
      console.log('Requesting orders from server...');
      socket.emit('get_orders', JSON.stringify({ studentId }));
    };

    // When receiving orders from server
    socket.on('orders_list', (data: string) => {
      console.log('Orders received from server:', data);
      const orders = JSON.parse(data);
      setOrderHistory(orders);
    });

    // Listen to events once when screen loads
    const unsubscribe = navigation.addListener('focus', fetchOrders);

    return () => {
      unsubscribe();
      socket.off('orders_list');
    };
  }, [navigation]);

  const clearOrderHistory = () => {
    Alert.alert(
      'Confirm Clear',
      'Are you sure you want to clear the order history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setOrderHistory([]);
            Alert.alert('Success', 'Order history cleared.');
          },
        },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="file-tray-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No orders placed yet</Text>
    </View>
  );

  const renderOrder = ({ item }: { item: Order }) => {
    const formattedDateTime = item.date
      ? format(new Date(item.date), 'dd/MM/yyyy hh:mm a')
      : 'Unknown Date';
    const totalPrice = item.total !== undefined
      ? `RM ${item.total.toFixed(2)}`
      : 'RM 0.00';
    const statusText = item.status || 'Unknown Status';
    const statusColor =
    statusText === 'Ready for collect' ? 'green' :
    statusText === 'Preparing' ? '#FF4500' : '#FFA500';

    return (
      <View style={styles.orderContainer}>
        <Text style={styles.orderNumber}>
          Order No: #{item.orderNumber ?? 'N/A'}
        </Text>
        <Text style={styles.orderDate}>{formattedDateTime}</Text>
        {item.items.map((orderItem) => (
          <View key={orderItem.id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {orderItem.name} x{orderItem.quantity}
            </Text>
            <Text style={styles.itemPrice}>
              RM {orderItem.price.toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalText}>{totalPrice}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>Status : </Text>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Order History</Text>
        <View style={{flex:0.85}}>
          <FlatList
            data={orderHistory}
            ListEmptyComponent={renderEmpty}
            renderItem={renderOrder}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
        
      </View>

      {orderHistory.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearOrderHistory}>
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
      )}
    </View>
  );
};

export default HistoryScreen;