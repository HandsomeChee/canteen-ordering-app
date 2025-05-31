import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import { io } from 'socket.io-client';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderNumber?: number;
  items: OrderItem[];
  status?: string;
}

const socket = io('http://10.0.2.2:5001/orders', {
  transports: ['websocket'],
});

const PreparingOrdersScreen = () => {
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = () => {
      socket.emit('get_orders');
    };
  
    fetchOrders(); // initial fetch
    const interval = setInterval(fetchOrders, 3000); // every 3s

    socket.on('orders_list', (data: string) => {
      const allOrders: Order[] = JSON.parse(data);
      const filtered = allOrders.filter(
        (order) => order.status === 'Preparing' || order.status === 'Ready for collect'
      );
      setPreparingOrders(filtered);
    });

    socket.on('order_deleted', (data: string) => {
      const result = JSON.parse(data);
      if (result.success) {
        fetchOrders(); // Trigger an update
      } else {
        Alert.alert("Delete Failed", result.error || "An error occurred.");
      }
    });

    return () => {
      clearInterval(interval);
      socket.off('orders_list');
      socket.off('order_deleted');
    };
  }, []);

  const markAsReady = (orderNumber?: number) => {
    if (!orderNumber) return;

    socket.emit('update_order_status', JSON.stringify({
      status: 'Ready for collect',
      orderNumber: orderNumber
    }));

    const updatedList = preparingOrders.filter((order) => order.orderNumber !== orderNumber);
    setPreparingOrders(updatedList);
  };

  const renderOrder = ({ item}: { item: Order}) => {
    const isReady = item.status === 'Ready for collect';

    const deleteOrder = (orderNumber?: number) => {
      if (!orderNumber) return;
      Alert.alert(
        'Remove Order',
        'Are you sure you want to remove this order from the list?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              socket.emit('delete_order', JSON.stringify({ orderNumber }));
            },
          },
        ]
      );
    };

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.orderTitle}>Order #{item.orderNumber ?? 'N/A'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isReady ? '#28a745' : '#FF4500' }, // green if ready
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            {isReady && (
              <TouchableOpacity onPress={() => deleteOrder(item.orderNumber)} style={{ marginLeft: 8 }}>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.itemList}>
          {item.items.map((orderItem) => (
            <View key={orderItem.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{orderItem.name}</Text>
              <Text style={styles.itemQty}>x{orderItem.quantity}</Text>
            </View>
          ))}
        </View>

        {!isReady && (
          <TouchableOpacity
            style={styles.readyButton}
            onPress={() => markAsReady(item.orderNumber)}
          >
            <Text style={styles.readyButtonText}>Mark as Ready for Collect</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
          <FlatList
            data={preparingOrders}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderOrder}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No orders are currently in preparation.</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor:'#acf8f8'
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth:0.3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#222',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  itemList: {
    paddingTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 15,
    color: '#555',
  },
  itemQty: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  readyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  readyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#DC7726',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
    bottom:100,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreparingOrdersScreen;
