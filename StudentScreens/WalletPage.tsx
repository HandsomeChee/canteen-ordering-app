import React, { useState,useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,Alert,Image} from 'react-native';
import { getDBConnection,getStudentBalanceById,updateStudentsCredit } from '../db-service';
import styles2 from '../styles/AccountStyle';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';

const WalletScreen = ({route,navigation}:any) => {
  const {studentPassword,studentId} = route.params
  const [balance, setBalance] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Credit/Debit Card', value: 'Credit/Debit Card', icon: () => <Image source={require('../images/visa.jpg')} style={styles.icon} /> },
    { label: 'Online Banking', value: 'Online Banking', icon: () => <Image source={require('../images/Banking.jpg')} style={styles.icon} /> },
    { label: "Touch 'n Go", value: "Touch 'n Go", icon: () => <Image source={require('../images/tng.jpg')} style={styles.icon} /> },
  ]);  

  useEffect(() => {
    const fetchBalance = async () => {
      const db = await getDBConnection();
      const balance = await getStudentBalanceById(db, studentId);
      setBalance(balance);
    };
    fetchBalance();
  }, []);

  const openModal = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      Alert.alert('Enter a valid top-up amount first');
      return;
    }
    setModalVisible(true);
  };

  const handleVerify = async () => {
    
    if (password === studentPassword) {
      const amount = parseFloat(topUpAmount);
      const newBalance = parseFloat((balance + amount).toFixed(2));

      try {
        const db = await getDBConnection();
        await updateStudentsCredit(db, studentId.toString(), newBalance);
        setBalance(newBalance);
        setTopUpAmount('');
        setPassword('');
        setModalVisible(false);
        Alert.alert('Top-up successful!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update balance in database.');
      }
    } else {
      Alert.alert('Incorrect password');
    }
  };
  
  return (
    <View style={styles2.container}>
        <View style={styles2.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile',{studentBalance:balance})} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles2.header}>Wallet</Text>
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.card}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>RM {balance.toFixed(2)}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter amount to Top Up"
            keyboardType="numeric"
            value={topUpAmount}
            onChangeText={setTopUpAmount}
          />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Select Payment Method :</Text>
          <DropDownPicker
            open={open}
            value={paymentMethod}
            items={items}
            setOpen={setOpen}
            setValue={setPaymentMethod}
            setItems={setItems}
            placeholder="Select a method"
            style={{
              borderColor: '#ccc',
              borderRadius: 12,
            }}
            dropDownContainerStyle={{
              borderColor: '#ccc',
              borderRadius: 12,
            }}
            zIndex={1000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
          />
        </View>

          <TouchableOpacity style={styles.topUpButton} onPress={openModal}>
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password to Confirm</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  secureTextEntry={secureText}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                  <MaterialCommunityIcons
                    name={secureText ? 'eye' : 'eye-off'}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleVerify}>
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    bottom:100
  },
  backButton: {
    position: 'absolute',
    top: 10,  
    left: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#f4f6f8',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 15,
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 48,
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  topUpButton: {
    backgroundColor: '#DC7726',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 3,
  },
  topUpButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#DC7726',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    paddingLeft:5
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color:'black'
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default WalletScreen;