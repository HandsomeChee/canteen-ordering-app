import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList,Button, Alert} from 'react-native';
import { getDBConnection, getStudents,deleteStudent } from '../db-service'; 

const ViewStudentsPage = () => {
    const [students, setStudents] = useState<any[]>([]);
  
    useEffect(() => {
      fetchStudents();
    }, []);
  
    const fetchStudents = async () => {
      try {
        const db = await getDBConnection();
        const allStudents = await getStudents(db);
        setStudents(allStudents);
      } catch (error) {
        console.error('Failed to fetch students', error);
      }
    };

    const handleDeleteStudent = async (id: string) => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this student?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const db = await getDBConnection();
                await deleteStudent(db, id);
                fetchStudents();
              } catch (error) {
                console.error('Failed to delete student', error);
              }
            },
          },
        ],
        { cancelable: true }
      );
    };
  
    const renderItem = ({ item }: { item: any }) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text>Email: {item.email}</Text>
        <Text>Phone: {item.phone_number}</Text>
        <Text>ID: {item.id}</Text>
        <Button title="Delete" color="#D9534F" onPress={() => handleDeleteStudent(item.id.toString())} />
      </View>
    );
  
    return (
      <View
        style={styles.background}
      >
        <View style={styles.container}>
          <FlatList
            data={students}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor:'#acf8f8'
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    card: {
      backgroundColor: 'white',
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      borderWidth:0.3,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#007BFF',
    },
  });
  
  export default ViewStudentsPage;