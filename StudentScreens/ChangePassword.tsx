import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,TouchableNativeFeedback } from 'react-native';
import styles2 from '../styles/AccountStyle';
import {getDBConnection,getStudentsPhoneNum,updatePasswordByPhone } from '../db-service';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChangePassword = ({ route,navigation }: any) => {
  const { studentPhone} = route.params;
  const [phoneNum,setPhoneNum] = useState(studentPhone);
  const [currentPassword,setPassword] = useState('');
  const [currentSecure,setCurrentSecure] = useState(true);
  const [newPassword,setNewPassword] = useState('');
  const [newSecure,setNewSecure] = useState(true);
  const [confirmPassword,setConfPassword] = useState('');
  const [confirmSecure,setConfSecure] = useState(true);
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [startsWithUppercase, setStartsWithUppercase] = useState(false);

  const handleSave = async() => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert("All fields are required");
        return;
    }
    
    if (newPassword !== confirmPassword) {
        Alert.alert("New passwords do not match");
        return;
    }

    try {
        const db = await getDBConnection();
        const student = await getStudentsPhoneNum(db,studentPhone, currentPassword);
        
        if (!student) {
          Alert.alert("Current password is incorrect");
          return;
        }

        await updatePasswordByPhone(db,phoneNum, newPassword);
        Alert.alert("Password updated successfully!");
        navigation.navigate('Profile',{
          studentPassword:newPassword
        });
    
      } catch (error) {
        console.error("Password update error:", error);
        Alert.alert("An error occurred while updating the password");
      }
  };

  const handleBack=()=>{
    navigation.goBack();
  }
  
  return (
    <View style={styles2.container}>
      <View style={styles2.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles2.header}>Change Password</Text>
      </View>
      <View style={styles.fieldsContainer}>
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    onChangeText={(currentPassword) => setPassword(currentPassword)}
                    value={currentPassword}
                    placeholder='Enter Current Password'
                    secureTextEntry={currentSecure}
                />
                <TouchableNativeFeedback onPress={() => setCurrentSecure(!currentSecure)}>
                    <MaterialCommunityIcons
                        name={currentSecure ? 'eye' : 'eye-off'}
                        size={24}
                        color="black"
                        style={{padding:5}}
                    />
                </TouchableNativeFeedback>
            </View>  
        </View>
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    onChangeText={(newPassword) =>{
                      setNewPassword(newPassword)
                      setIsLongEnough(newPassword.length > 6);
                      setStartsWithUppercase(/^[A-Z]/.test(newPassword));
                    }}
                    value={newPassword}
                    placeholder='Enter New Password'
                    secureTextEntry={newSecure}
                />
                <TouchableNativeFeedback onPress={() => setNewSecure(!newSecure)}>
                    <MaterialCommunityIcons
                        name={newSecure ? 'eye' : 'eye-off'}
                        size={24}
                        color="black"
                        style={{padding:5}}
                    />
                </TouchableNativeFeedback>
            </View>
        </View>
        <View style={{ width: 300, marginBottom: 20 }}>
          <View style={styles.requirementRow}>
              <MaterialCommunityIcons
                  name={isLongEnough ? 'check-circle' : 'close-circle'}
                  size={20}
                  color={isLongEnough ? 'green' : 'red'}
              />
              <Text style={styles.passwordRequirement}> Must be more than 6 characters</Text>
          </View>
          <View style={styles.requirementRow}>
              <MaterialCommunityIcons
                  name={startsWithUppercase ? 'check-circle' : 'close-circle'}
                  size={20}
                  color={startsWithUppercase ? 'green' : 'red'}
              />
              <Text style={styles.passwordRequirement}> Must start with an uppercase letter</Text>
          </View>
      </View>
        <View style={styles.inputWrapper}>
            <Text style={styles.label}> Confirm New Password</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    onChangeText={(confirmPassword) => 
                      setConfPassword(confirmPassword)
                    }
                    value={confirmPassword}
                    placeholder='Confirm New Password'
                    secureTextEntry={confirmSecure}
                />
                <TouchableNativeFeedback onPress={() => setConfSecure(!confirmSecure)}>
                    <MaterialCommunityIcons
                        name={confirmSecure ? 'eye' : 'eye-off'}
                        size={24}
                        color="black"
                        style={{padding:5}}
                    />
                </TouchableNativeFeedback>
            </View>
        </View>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldsContainer: {
    padding:20
  },
  backButton: {
    position: 'absolute',
    top: 10,  
    left: 10,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 18,
  },
  inputEditable: {
    backgroundColor: "#fff",
    borderColor: "#007BFF",
  },
  pencilButton: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#DC7726',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 30,
    elevation: 3,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  passwordRequirement: {
    fontSize: 14,
    color: 'black',
    fontWeight: "bold",
  },
});

export default ChangePassword;