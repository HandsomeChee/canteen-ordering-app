import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './context/CartContext';
import ResetPage from './StudentScreens/ResetPage';
import AdminLogin from './AdminScreens/AdminLogin';
import ViewStudentsPage from './AdminScreens/ViewStudentScreen';
import SignUpPage from './StudentScreens/SignUpPage';
import CombinedLogin from './StudentScreens/CombinedLogin';
import FirstScreen from "./StudentScreens/FirstScreen";
import AdminMain from './AdminScreens/AdminMain';
import MainScreen from './StudentScreens/MainScreen';
import { RootStackParamList } from './Types';

const Stack = createStackNavigator<RootStackParamList>();

// Stack Navigator
const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="First">
          <Stack.Screen name = "First" component={FirstScreen} options={{ headerShown: false }} />
          <Stack.Screen name = "Login" component={CombinedLogin} />
          <Stack.Screen name = 'Admin Login' component={AdminLogin}/>
          <Stack.Screen name = 'Admin Main' component={AdminMain} options={{ headerShown: false }}/>
          <Stack.Screen name = "Reset Password" component={ResetPage} />
          <Stack.Screen name = "Sign Up" component={SignUpPage} />
          <Stack.Screen name = "View Students" component={ViewStudentsPage} />
          <Stack.Screen name = "Main Screen" component={MainScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
