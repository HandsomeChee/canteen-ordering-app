import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet, TextInput, TouchableNativeFeedback } from 'react-native';
import { RootStackParamList } from '../Types';
import type { StackScreenProps } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import { getDBConnection, createStudent } from '../db-service';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export type Props = StackScreenProps<RootStackParamList, 'Sign Up'>;

const isFilled = (value: string) => value.trim() !== '';

const SignUpPage = ({ route, navigation }: any) => {
  const [email, setEmail] = useState('');
  const [phoneNum, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [studentID, setStudentID] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [startsWithUppercase, setStartsWithUppercase] = useState(false);

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
      setPhone(numericText);
      if (numericText.length === 10 || numericText.length === 11) {
        setPhoneError('');
      } else {
        setPhoneError('Phone number must be 10 or 11 digits');
      }
    }
  };

  const handleShowCode = async () => {
    const isValidPhone = phoneError === '';
    const isValidEmail = emailError === '';
    const allFilled = email && phoneNum && username && studentID && password;

    if (allFilled && isValidPhone && isValidEmail && isLongEnough && startsWithUppercase) {
      await createStudent(
        await getDBConnection(),
        Number(studentID),
        username,
        email,
        phoneNum,
        password,
        0.0
      );
      route.params.refresh();
      Alert.alert('Sign Up Successful');
      navigation.goBack();
    } else {
      Alert.alert('Please ensure all fields are valid.');
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={[styles.inputWithIcon, isFilled(email) && emailError === '' && styles.inputFilled]}>
          <TextInput
            style={styles.input}
            onChangeText={validateEmail}
            value={email}
            placeholder='Email'
            keyboardType="email-address"
          />
          {isFilled(email) && emailError === '' && (
            <MaterialCommunityIcons name="check" size={20} color="green" />
          )}
        </View>
        {emailError !== '' && (
          <Text style={styles.errorText}>{emailError}</Text>
        )}

        {/* Phone */}
        <Text style={styles.label}>Phone Number</Text>
        <View style={[styles.inputWithIcon, isFilled(phoneNum) && phoneError === '' && styles.inputFilled]}>
          <TextInput
            style={styles.input}
            onChangeText={validatePhone}
            value={phoneNum}
            placeholder='Phone Number'
            keyboardType="phone-pad"
          />
          {isFilled(phoneNum) && phoneError === '' && (
            <MaterialCommunityIcons name="check" size={20} color="green" />
          )}
        </View>
        {phoneError !== '' && (
          <Text style={styles.errorText}>{phoneError}</Text>
        )}

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <View style={[styles.inputWithIcon, isFilled(username) && styles.inputFilled]}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder='Username'
          />
          {isFilled(username) && (
            <MaterialCommunityIcons name="check" size={20} color="green" />
          )}
        </View>

        {/* Student ID */}
        <Text style={styles.label}>Student ID</Text>
        <View style={[styles.inputWithIcon, isFilled(studentID) && styles.inputFilled]}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setStudentID(text)}
            value={studentID}
            placeholder='Student ID'
            keyboardType="phone-pad"
          />
          {isFilled(studentID) && (
            <MaterialCommunityIcons name="check" size={20} color="green" />
          )}
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={[styles.passwordContainer, isFilled(password) && styles.inputFilled]}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={(text) => {
              setPassword(text);
              setIsLongEnough(text.length > 6);
              setStartsWithUppercase(/^[A-Z]/.test(text));
            }}
            value={password}
            placeholder='Password'
            secureTextEntry={secureText}
          />
          <TouchableNativeFeedback onPress={() => setSecureText(!secureText)}>
            <MaterialCommunityIcons
              name={secureText ? 'eye' : 'eye-off'}
              size={24}
              color="#007BFF"
              style={{ padding: 5 }}
            />
          </TouchableNativeFeedback>
        </View>

        {/* Password Requirements */}
        <View style={{ width: 300, marginBottom: 10 }}>
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

        {/* Submit Button */}
        <View>
          <TouchableNativeFeedback onPress={handleShowCode}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#DDC077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  inputWithIcon: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  inputFilled: {
    borderColor: 'green',
  },
  input: {
    flex: 1,
    fontSize: 17,
    height: 48,
  },
  label: {
    width: 300,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: 'white',
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 17,
    height: 48,
    paddingHorizontal: 10,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  passwordRequirement: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default SignUpPage;