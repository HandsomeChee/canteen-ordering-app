import React, { useState, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Types';
import { getDBConnection, getStudents, createTableStudents } from '../db-service';

export type Props = StackScreenProps<RootStackParamList, 'First'>;

const App = ({ navigation }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [students, setStudents] = useState<any>([]);
  const _query = async () => {
    setStudents(await getStudents(await getDBConnection()));
  }

  const _createTable = async () => {
    await createTableStudents(await getDBConnection());
  }

  useEffect(() => {
    _createTable();
    _query();
  }, []);

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* Header Section (70% of container) */}
        <View style={styles.header}>
          <Image
            source={require('../images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 35, fontWeight: "bold", fontFamily: 'Iansui-Regular', color: 'black', textAlign: "center" }}>
            Welcome to
          </Text>
          <Text style={{ fontSize: 35, fontWeight: "bold", fontFamily: 'Iansui-Regular', color: 'black', textAlign: "center" }}>
            XXX Canteen
          </Text>
        </View>

        {/* Button Section (30% of container) */}
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={{ fontSize: 25, fontWeight: "bold", color: 'white' }}>Student</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity onPress={() => { navigation.navigate('Admin Login') }}>
              <Text style={{ fontSize: 25, fontWeight: "bold", color: 'white' }}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.Modaltitle}>Choose a Login method</Text>

              <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('Login', { loginMethod: 'email',refresh: _query }); }} style={styles.option}>
                <Text style={styles.optionText}>Log In with Email Address</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('Login', { loginMethod: 'phone', refresh: _query }); }} style={styles.option}>
                <Text style={styles.optionText}>Log In with Phone Number</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('Sign Up', { refresh: _query }); }} style={styles.option}>
                <Text style={styles.optionText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    flex: 0.55,
    backgroundColor:'#DDC077',
    justifyContent: 'center',
    alignItems: 'center',
    elevation:5,
  },
  buttons: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 150,
    paddingVertical: 15,
    backgroundColor: '#DC7726',
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 50,
    elevation: 5,
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
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  option: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#DC7726',
    fontWeight: 'bold',
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

export default App;
