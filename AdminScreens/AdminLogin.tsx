import React, { useState,useEffect } from 'react';
import { Alert,Text, StyleSheet, TextInput, View,TouchableNativeFeedback, ImageBackground } from 'react-native';
import { RootStackParamList } from '../Types'; 
import { getDBConnection,getAdminLogin,createTableAdmins,createAdmin,adminExists} from '../db-service';
import type { StackScreenProps } from '@react-navigation/stack';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from '../styles/LoginStyles';

export type Props = StackScreenProps<RootStackParamList, 'Admin Login'>;

const AdminLogin = ({navigation}: Props) => {
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const _createTable = async () => {
      await createTableAdmins(await getDBConnection());
  };

  const _createAdmin = async () => {
    const db = await getDBConnection();
    const exists = await adminExists(db, 1001);
    if (!exists) {
      await createAdmin(db, 1001, 'adminid1001');
    }
  }

  useEffect(()=>{
    _createTable();
    _createAdmin();
  },[]);

  const handleShowCode =async() =>{
    if (adminID === '' || password === '') {
      Alert.alert('Please fill in all fields');
      return;
    }
      
    try {
      const db = await getDBConnection();
      const adminCount = await getAdminLogin(db, Number(adminID), password);
      
      if (adminCount > 0) {
        Alert.alert('Login Successful');
        navigation.navigate('Admin Main');
      } else {
        Alert.alert('Invalid Admin ID or password');
        }
    } catch (error) {
      console.error(error);
      Alert.alert('Login failed. Please try again later.');
    }
  }

  return (
    <View 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Admin ID</Text>
        <TextInput
          style={styles.input}
          onChangeText={(adminID) => setAdminID(adminID)}
          value={adminID}
          placeholder='Admin ID'
        />
        <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordContainer,{marginBottom:15}]}>
            <TextInput
              style={styles.passwordInput}
              onChangeText={(password) => {
                setPassword(password);
              }}
              value={password}
              placeholder='Password'
              secureTextEntry={secureText}
            />
            <TouchableNativeFeedback onPress={() => setSecureText(!secureText)}>
              <MaterialCommunityIcons
                name={secureText ? 'eye' : 'eye-off'}
                size={24}
                color="black"
                style={{padding:5}}
              />
            </TouchableNativeFeedback>
          </View>
        <View>
          <TouchableNativeFeedback onPress={handleShowCode}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
};

export default AdminLogin;