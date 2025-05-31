import React, { useState } from 'react';
import {Text,Modal,StyleSheet,View,Alert, TouchableOpacity} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableHighlight } from 'react-native-gesture-handler';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from '../Types';
import styles2 from '../styles/AccountStyle';

type ProfileScreenProps = BottomTabScreenProps<RootStackParamList, 'Profile'>;
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { studentId, studentName, studentEmail, studentPhone,studentPassword,studentBalance} = route.params;

  const menuOptions = [
    { id: '1', title: 'User Profile & Settings', subtitle: 'View & Edit profile, Change Password' },
    { id: '2', title: 'Wallet', subtitle: 'View Wallet Balance, Top Up' },
    { id: '3', title: 'Help & Support', subtitle: 'FAQs, Report an Issue, Rate & Review Orders' },
  ];

  const handleViewProfile = () => {
    setModalVisible(false);
    navigation.navigate("User Profile & Settings", {
      studentId,
      studentName,
      studentEmail,
      studentPhone,
    });
  };
  
  const handleChangePassword = () => {
    setModalVisible(false);
    navigation.navigate("Change Password", {
      studentPhone
    });
  };

  const iconOptions = (id: string) => {
    switch (id) {
      case '1':
        return <MaterialCommunityIcons name="account-cog" size={32} color="black" />;
      case '2':
        return <MaterialCommunityIcons name="wallet" size={32} color="black" />;
      case '3':
        return <MaterialCommunityIcons name="help-circle-outline" size={32} color="black" />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            console.log('User logged out');
            navigation.navigate('First');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles2.container}>
      <View style={styles2.headerContainer}>
        <Text style={styles2.header}>Account</Text>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.background}>
          <View style={styles.topContainer}>
            <View style={styles.profilePictureContainer}>
              <Icon name="user-circle" size={70} color="black" />
            </View>
            <View style={styles.profileInfoContainer}>
              <Text style={styles.profileName}>{studentName}</Text>
              <Text style={styles.profileID}>Student ID: {studentId}</Text>
            </View>
          </View>
        </View>
        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.Modaltitle}>User Profile & Settings</Text>
              <TouchableOpacity
                style={styles.option}
                onPress={handleViewProfile}
              >
                <Text style={styles.optionText}>View & Update Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={handleChangePassword}
              >
                <Text style={styles.optionText}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.belowContainer}>
          <View>
            {menuOptions.map((item) => (
              <TouchableHighlight
                underlayColor={'#f5f5f5'}
                activeOpacity={0.6}
                key={item.id}
                onPress={() => {
                  if (item.id === '1') {
                    setModalVisible(true);
                  } else if (item.id === '2') {
                    navigation.navigate("Wallet",{studentId:studentId,studentPassword:studentPassword,studentBalance:studentBalance});
                  } else if (item.id === '3') {
                    navigation.navigate("Help & Support");
                  }
                }}
              >
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    {iconOptions(item.id)}
                    <View style={styles.textContainer}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.subTitle}>{item.subtitle}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color="black" />
                  </View>
                </View>
              </TouchableHighlight>
            ))}

            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
  },
  background: {
    height: 150,
    backgroundColor: '#DDC077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  belowContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  profilePictureContainer: {
    flex: 0.3,
    alignItems: 'center',
  },
  profileInfoContainer: {
    flex: 0.7,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d2d2d',
    letterSpacing: 0.2,
  },
  profileID: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  item: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.15,
  },
  subTitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor:'#DC7726',
    marginHorizontal: 40,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems:'center',
    alignSelf:'center',
    elevation:2,
    width: '30%',
  },
  logoutText: {
    color:'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  Modaltitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    elevation: 10,
  },
  option: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#DC7726',
    fontWeight:'bold',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 18,
    color: 'black',
  },
});

export default ProfileScreen;