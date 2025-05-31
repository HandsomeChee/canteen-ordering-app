import React, { useEffect, useState } from 'react';
import {Alert} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import ManageMenuScreen from './ManageMenuScreen';
import UpdateOrderScreen from './UpdateOrderScreen';
import PreaparingOrderScreen from './PreparingOrderScreen';
import ViewStudentsPage from './ViewStudentScreen';

import socket, {
  connectSocket,
  disconnectSocket,
  joinStudentRoom
} from '../src/socket';

import { fetchOrders, Order } from '../src/api';
import PreparingOrdersScreen from './PreparingOrderScreen';

interface OrderNotification {
  orderId: string | number;
  status: string;
  message?: string;
}
interface LoggedNotification {
  notification: OrderNotification & { timestamp: string };
  room?: string;
}

const Tab = createBottomTabNavigator();

export default function App({navigation}:any) {
  const [notifs, setNotifs] = useState<LoggedNotification[]>([]);

  useEffect(() => {
    // Connect socket
    connectSocket();

    // After connected, join all student rooms
    socket.once('connect', async () => {
      console.log('[App Socket] Connected:', socket.id);

      try {
        const orders: Order[] = await fetchOrders();
        const studentIds = Array.from(new Set(orders.map(o => o.studentId)));
        studentIds.forEach(id => {
          console.log(`[App Socket] Joining room student_${id}`);
          joinStudentRoom(id);
        });
      } catch (e) {
        console.error('[App Socket] Failed to fetchOrders:', e);
      }
    });

    // Listen to notifications from backend
    socket.on('notification', (data: { notification: OrderNotification; room?: string }) => {
      console.log('[App Socket] notification:', data);
      const entry: LoggedNotification = {
        notification: {
          ...data.notification,
          timestamp: new Date().toISOString()
        },
        room: data.room
      };
      setNotifs(prev => [entry, ...prev.slice(0, 99)]);
      try {
        Toast.show({
          type: 'info',
          text1: `Order #${data.notification.orderId}`,
          text2: `is now ${data.notification.status}`
        });
      } catch (e) {
        console.error('Toast failed:', e, data);
      }
    });

    // Clean up when unmount
    return () => {
      socket.off('connect');
      socket.off('notification');
      disconnectSocket();
    };
  }, []);

  return (
    <>
        <Tab.Navigator
          initialRouteName="ViewStudent"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;
              if (route.name === 'ManageMenu')
                iconName = focused ? 'fast-food' : 'fast-food-outline';
              else if (route.name === 'UpdateOrder')
                iconName = focused ? 'receipt' : 'receipt-outline';
              else if (route.name === 'PreparingOrder')
                iconName = focused ? 'time' : 'time-outline';
              else
                iconName = focused ? 'eye' : 'eye-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerLeft: () => (
              <Ionicons
                name="exit-outline"
                size={25}
                color="#fff"
                style={{ marginLeft: 15 }}
                onPress={() => {
                  Alert.alert(
                    'Confirm Logout',
                    'Are you sure you want to log out?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Yes',
                        style: 'destructive',
                        onPress: () => navigation.navigate('First')
                      }
                    ]
                  );
                }}
              />
            ),
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: 'gray',
            headerStyle: { backgroundColor: '#4CAF50' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center'
          })}
        >
          <Tab.Screen
            name="ManageMenu"
            component={ManageMenuScreen}
            options={{ title: 'Manage Menu' }}
          />
          <Tab.Screen
            name="UpdateOrder"
            component={UpdateOrderScreen}
            options={{ title: 'Update Orders' }}
          />
          <Tab.Screen 
            name="PreparingOrder" 
            component={PreparingOrdersScreen}
            options={{ title: 'Preparing Order' }}
          />
          <Tab.Screen 
            name="ViewStudent"
            component={ViewStudentsPage}
            options={{ title: 'View Students' }}
          />
        </Tab.Navigator>
      <Toast />
    </>
  );
}
