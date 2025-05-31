import React ,{useState}from 'react';
import { Alert, Text, StyleSheet, TextInput, View,TouchableNativeFeedback} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getDBConnection, updatePasswordByEmail,updatePasswordByPhone } from '../db-service';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Types';

export type Props = StackScreenProps<RootStackParamList, 'Reset Password'>;

const ResetPage = ({ navigation,route }: Props) => {
    const mode = route.params?.mode || 'email';
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmPassword,setConPassword]=useState('');
    const [secureText, setSecureText] = useState(true);
    const [secureText2, setSecureText2] = useState(true);
    const [isLongEnough, setIsLongEnough] = useState(false);
    const [startsWithUppercase, setStartsWithUppercase] = useState(false);

    const handleShowCode = async() =>{
        if (newpassword===''&& confirmPassword===''){
            Alert.alert("Password cannot be empty !");
            return
        }
        else if(newpassword !== confirmPassword){
            Alert.alert("Passwords do not match. \nPlease try again.")
            return
        }
      try {
        const db = await getDBConnection();
        const success = mode === 'phone'
            ? await updatePasswordByPhone(db, emailOrPhone, confirmPassword)
            : await updatePasswordByEmail(db, emailOrPhone, confirmPassword);
        
        if (success) {
          Alert.alert("Password updated successfully.");
          navigation.goBack();
        } else {
          Alert.alert("Failed to update password.");
        }
      } catch (error) {
        Alert.alert("Failed to update password. Please try again later.");
        console.error(error);
      }
    }
    return (
        <View
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.label}>{mode === 'phone' ? 'Phone Number' : 'Email Address'}</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setEmailOrPhone(text)}
                        value={emailOrPhone}
                        placeholder={mode === 'phone' ? 'Phone Number' : 'Email'}
                        keyboardType={mode === 'phone' ? 'phone-pad' : 'email-address'}
                    />
                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        onChangeText={(newpassword) => {
                        setNewPassword(newpassword);
                        setIsLongEnough(newpassword.length > 6);
                        setStartsWithUppercase(/^[A-Z]/.test(newpassword));
                        }}
                        value={newpassword}
                        placeholder='New Password'
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
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        onChangeText={(confirmPassword) => {
                        setConPassword(confirmPassword);
                        }}
                        value={confirmPassword}
                        placeholder='Confirm Password'
                        secureTextEntry={secureText2}
                    />
                    <TouchableNativeFeedback onPress={() => setSecureText2(!secureText2)}>
                        <MaterialCommunityIcons
                            name={secureText2 ? 'eye' : 'eye-off'}
                            size={24}
                            color="black"
                            style={{padding:5}}
                        />
                    </TouchableNativeFeedback>
                </View>
            <View>
                <TouchableNativeFeedback onPress={handleShowCode}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create ({
    background: {
        flex: 1,
        backgroundColor:'#DDC077',
        justifyContent: 'center', 
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
    },
    label: {
        width:300,
        fontSize: 20,
        color:'black',
        fontWeight: "bold",
    },
    input: {
        width: 300,
        fontSize: 20,
        height: 48,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor:'#ccc',
        backgroundColor: 'white',
        marginVertical: 10,
      },
    button: {
        backgroundColor : '#DC7726',
        marginTop:10,
        paddingHorizontal:20,
        padding: 10,
        borderRadius: 12,
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
        borderWidth: 1,
        borderRadius: 8,
        borderColor:'#ccc',
        backgroundColor: 'white',
        paddingRight: 10,
      },
      passwordInput: {
        flex: 1,
        fontSize: 20,
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
        fontWeight: "bold",
      },
});

export default ResetPage;