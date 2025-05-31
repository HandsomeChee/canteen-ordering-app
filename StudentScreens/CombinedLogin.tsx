import React, { useState } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableNativeFeedback,
} from 'react-native';
import { getDBConnection, getStudentEmail, getStudentsPhoneNum } from '../db-service';
import { RootStackParamList } from '../Types';
import type { StackScreenProps } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
import styles from '../styles/LoginStyles';

export type Props = StackScreenProps<RootStackParamList, 'Login'>;

const CombinedLogin = ({ navigation,route }: Props) => {
  const { clearCart } = useCart();
  const { loginMethod, refresh } = route.params;
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      const db = await getDBConnection();
      let student;

      if (loginMethod === 'email') {
        student = await getStudentEmail(db, identifier, password);
      } else if (loginMethod === 'phone') {
        student = await getStudentsPhoneNum(db, identifier, password);
      }

      if (student) {
        clearCart();
        Alert.alert('Login Successful');
        navigation.navigate('Main Screen', {
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          studentPhone: student.phone_number,
          studentPassword: student.password,
          studentBalance: student.credit,
        });
      } else {
        Alert.alert('Incorrect login details ! Please try again. ');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login failed. Please try again later.');
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.label}>{loginMethod === 'email' ? 'Email Address' : 'Phone Number'}</Text>
        <TextInput
          style={styles.input}
          onChangeText={setIdentifier}
          value={identifier}
          placeholder={loginMethod === 'email' ? 'Email' : 'Phone Number'}
          keyboardType={loginMethod === 'email' ? 'email-address' : 'phone-pad'}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={secureText}
          />
          <TouchableNativeFeedback onPress={() => setSecureText(!secureText)}>
            <MaterialCommunityIcons
              name={secureText ? 'eye' : 'eye-off'}
              size={24}
              color="black"
              style={{ padding: 5 }}
            />
          </TouchableNativeFeedback>
        </View>

        <TouchableNativeFeedback onPress={() => navigation.navigate('Reset Password', { mode: loginMethod })}>
          <Text style={styles.ButtonText}>Forgot Password?</Text>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={handleLogin}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

export default CombinedLogin;
