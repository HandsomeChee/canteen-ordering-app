import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles2 from '../styles/AccountStyle';
import {getDBConnection,updateStudent } from '../db-service';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EditProfile = ({ route,navigation }: any) => {
  const { studentId, studentName, studentEmail,studentPhone} = route.params;
  const [username, setUsername] = useState(studentName);
  const [studentID, setStudentID] = useState(String(studentId));
  const [email, setEmail] = useState(studentEmail);
  const [phoneNum, setPhoneNum] = useState(studentPhone);
  const [editableField, setEditableField] = useState<string | null>(null);
  // Error messages
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!text.includes('@') || !text.includes('.com')) {
      setEmailError('Email must contain "@" and ".com"');
    } else {
      setEmailError('');
    }
  };

  const validatePhone = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 11) {
      setPhoneNum(numericText);
      if (numericText.length === 10 || numericText.length === 11) {
        setPhoneError('');
      } else {
        setPhoneError('Phone number must be 10 or 11 digits');
      }
    }
  };

  const handleSave = async () => {
    let valid = true;

    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty.");
      valid = false;
    } else if (!email.trim()) {
      setEmailError('Email cannot be empty.');
      valid = false;
    } else if (emailError) {
      valid = false;
    }

    if (!phoneNum.trim()) {
      setPhoneError('Phone number cannot be empty.');
      valid = false;
    } else if (phoneError) {
      valid = false;
    }

    if (!valid) return;

    try {
      const db = await getDBConnection();
      await updateStudent(db, Number(studentID), username, email, phoneNum, studentId);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate('Profile', {
        studentId: Number(studentID),
        studentName: username,
        studentEmail: email,
        studentPhone: phoneNum,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("An error occurred while updating the profile");
    }
  };

  const renderField = (
    label: string,
    value: string,
    setValue: (text: string) => void,
    fieldName: string,
    secureTextEntry?: boolean,
    error?: string
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput 
          style={[styles.input, editableField === fieldName && styles.inputEditable]}
          value={value}
          editable={editableField === fieldName}
          onChangeText={(text) => {
            if (fieldName === 'email') validateEmail(text);
            else if (fieldName === 'phoneNum') validatePhone(text);
            else setValue(text);
          }}
          placeholder={`Enter ${label.toLowerCase()}`}
          secureTextEntry={secureTextEntry}
          keyboardType={fieldName === 'phoneNum' ? 'numeric' : 'default'}
        />
        <TouchableOpacity style={styles.pencilButton} onPress={() => setEditableField(editableField === fieldName ? null : fieldName)}>
          <MaterialCommunityIcons name="pencil" size={22} color='black' />
        </TouchableOpacity>
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles2.container}>
      <View style={styles2.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles2.header}>User Profile</Text>
      </View>
      <View style={styles.fieldsContainer}>
        {renderField("Username", username, setUsername, "username")}
        {renderField("Email", email, setEmail, "email",false,emailError)}
        {renderField("Phone Number", phoneNum, setPhoneNum, "phoneNum",false,phoneError)}
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
    marginBottom: 5,
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
    borderColor: '#DC7726',
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
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 13,
  },
});

export default EditProfile;