import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator,StackScreenProps} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuScreen from './MenuScreen';
import CartScreen from './CartScreen';
import OrderScreen from './HistoryScreen';
import PaymentScreen from './PaymentScreen';
import ProfileScreen from './ProfileScreen';
import UserProfile from './UserProfile';
import HelpScreen from './HelpPage';
import WalletScreen from './WalletPage';
import ChangePassword from './ChangePassword';
import { CartProvider } from '../context/CartContext';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../Types';
import styles from '../styles/AppStyle';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

export type Props = StackScreenProps<RootStackParamList,'Main Screen'>;

const AnimatedIcon = ({ name, focused }:any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.15 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        focused && styles.focusedIconWrapper,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <Icon name={name} size={25} color="#fff" />
    </Animated.View>
  );
};

const toastConfig = {
  success: (props: any) => (
    <View style={styles.toastSuccess}>
      <Icon name="checkmark-circle" size={24} color="white" />
      <View style={styles.toastContent}>
        <Text style={styles.toastText1}>{props.text1}</Text>
        <Text style={styles.toastText2}>{props.text2}</Text>
      </View>
    </View>
  ),
};

const TabNavigator = ({ studentId, studentName,studentEmail,studentPhone,studentPassword,studentBalance }: { 
    studentId: number, 
    studentName: string,
    studentEmail:string,
    studentPhone:string,
    studentPassword:string,
    studentBalance:number
  }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
      tabBarIcon: ({ focused }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home-outline';
        else if (route.name === 'Cart') iconName = 'cart-outline';
        else if (route.name === 'Order') iconName = 'time-outline';
        else if (route.name === 'Profile') iconName = 'person-outline';

        return <AnimatedIcon name={iconName} focused={focused} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={MenuScreen} />
    <Tab.Screen name="Cart" component={CartScreen} initialParams={{studentId}} />
    <Tab.Screen name="Order" component={OrderScreen} initialParams={{ studentId }}  />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      initialParams={{ studentId, studentName, studentEmail, studentPhone,studentPassword,studentBalance}}
    />
  </Tab.Navigator>
);


const App = ({ route }: Props) => {
  const { studentId, studentName,studentEmail,studentPhone,studentPassword,studentBalance } = route.params;
  return (
    <CartProvider>
        <Stack.Navigator >
        <Stack.Screen
          name="TabNavigator"
          options={{ headerShown: false }}
        >
          {() => 
          <TabNavigator 
            studentId={studentId} 
            studentName={studentName} 
            studentEmail={studentEmail}
            studentPhone={studentPhone}
            studentPassword={studentPassword}
            studentBalance={studentBalance}
          />}
        </Stack.Screen>
          <Stack.Screen name="User Profile & Settings" component={UserProfile} options={{ headerShown: false }}/>
          <Stack.Screen name="Change Password" component={ChangePassword} options={{ headerShown: false }}/>
          <Stack.Screen name="Wallet" component={WalletScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Help & Support" component={HelpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} initialParams={{studentId}} />
          <Stack.Screen name="OrderScreen" component={OrderScreen} />
        </Stack.Navigator>
      <Toast config={toastConfig} position="bottom" bottomOffset={100} />
    </CartProvider>
  );
};


export default App;