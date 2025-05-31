import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, ActivityIndicator, Text, Alert, Image
} from 'react-native';
import {
  TextInput, Button, Card, Title, Paragraph
} from 'react-native-paper';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

import socket from '../src/socket';
import {
  fetchMenu,
  addMenuItem,
  updateMenuItem,
  updateMenuItemWithImage,
  deleteMenuItem,
  MenuItem
} from '../src/api';

const BACKEND_URL = 'http://10.0.2.2:3000';

export default function ManageMenuScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [originalImageKey, setOriginalImageKey] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMenu();
      setMenu(data);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load menu' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
    setSelectedImage(null);
    setOriginalImageKey(undefined);
    setEditingId(null);
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Toast.show({ type: 'error', text1: 'Image Picker Error', text2: response.errorMessage });
        return;
      }
      if (response.assets?.length) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleSave = async () => {
    if (!name || !category || !price || !description || (!selectedImage && !originalImageKey)) {
      Toast.show({ type: 'error', text1: 'Please fill all fields & select image' });
      return;
    }
    if (isNaN(+price)) {
      Toast.show({ type: 'error', text1: 'Price must be a number' });
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        if (selectedImage) {
          await updateMenuItemWithImage(editingId, {
            name,
            category,
            price: parseFloat(price),
            description,
            image: {
              uri: selectedImage.uri!,
              name: selectedImage.fileName || `photo_${Date.now()}.jpg`,
              type: selectedImage.type
            }
          });
        } else {
          await updateMenuItem(editingId, {
            name,
            category,
            price: parseFloat(price),
            description,
            imageKey: originalImageKey!
          });
        }
        Toast.show({ type: 'success', text1: 'Item updated' });
      } else {
        await addMenuItem({
          name,
          category,
          price: parseFloat(price),
          description,
          image: {
            uri: selectedImage!.uri!,
            name: selectedImage!.fileName || `photo_${Date.now()}.jpg`,
            type: selectedImage!.type || 'image/jpeg'
          }
        });
        Toast.show({ type: 'success', text1: 'Item added' });
      }

      socket.emit('menuUpdated'); 
      setModalVisible(false);
      resetForm();
      loadMenu();
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: editingId ? 'Update failed' : 'Add failed',
        text2: e.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderItem = ({ item }: { item: MenuItem }) => {
    const uri = item.imageKey ? BACKEND_URL + item.imageKey : undefined;
    return (
      <Card style={styles.card}>
        {uri && <Card.Cover source={{ uri }} />}
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>Category: {item.category}</Paragraph>
          <Paragraph>{item.description}</Paragraph>
          <Paragraph style={styles.price}>RM {(+item.price).toFixed(2)}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {
            setEditingId(item.id);
            setName(item.name);
            setCategory(item.category || '');
            setDescription(item.description || '');
            setPrice(String(item.price));
            setSelectedImage(null);
            setOriginalImageKey(item.imageKey);
            setModalVisible(true);
          }}>Edit</Button>
          <Button onPress={() => Alert.alert('Confirm delete?', '', [
            { text: 'Cancel' },
            {
              text: 'OK', onPress: async () => {
                await deleteMenuItem(item.id);
                Toast.show({ type: 'info', text1: 'Item deleted' });
                socket.emit('menuUpdated'); 
                loadMenu();
              }
            }
          ])}>Delete</Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.background}>
        <View style={styles.container}>
          <Button
            icon="plus-circle"
            mode="contained"
            onPress={() => { resetForm(); setModalVisible(true); }}
            style={styles.addButton}
          >
            Add New Item
          </Button>

          {menu.length === 0 ? (
            <Text style={styles.emptyText}>No items</Text>
          ) : (
            <FlatList
              data={menu}
              renderItem={renderItem}
              keyExtractor={i => String(i.id)}
            />
          )}

          <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Title>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</Title>
              <TextInput label="Name" value={name} onChangeText={setName} style={styles.input}/>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                <Picker.Item label="Select category..." value="" />
                <Picker.Item label="Rice" value="Rice" />
                <Picker.Item label="Noodle" value="Noodle" />
                <Picker.Item label="Drinks" value="Drinks" />
                <Picker.Item label="Dessert" value="Dessert" />
                <Picker.Item label="Snacks" value="Snacks" />
              </Picker>
              <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input}/>
              <TextInput label="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input}/>
              <Button icon="camera" mode="outlined" onPress={pickImage} style={styles.input}>
                {selectedImage ? 'Image Selected' : 'Choose Image'}
              </Button>
              {selectedImage?.uri && (
                <Image source={{ uri: selectedImage.uri }} style={styles.preview}/>
              )}
              <View style={styles.modalActions}>
                <Button onPress={() => setModalVisible(false)} disabled={isSaving}>Cancel</Button>
                <Button mode="contained" onPress={handleSave} loading={isSaving} disabled={isSaving}>
                  {editingId ? 'Update' : 'Save'}
                </Button>
              </View>
            </View>
          </Modal>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor:'#acf8f8'
  },
  picker: {
    marginBottom: 12,
    backgroundColor: '#f0f0f0'
  },
  container:    { flex:1, backgroundColor: 'rgba(255, 255, 255, 0.7)' },
  centered:     { flex:1, justifyContent:'center', alignItems:'center' },
  card:         { marginVertical:8 },
  price:        { fontWeight:'bold', marginTop:5 },
  emptyText:    { textAlign:'center', marginTop:20 },
  addButton:    { margin:10 },
  modalContent: { backgroundColor:'#fff', padding:20, borderRadius:8 },
  input:        { marginBottom:12 },
  modalActions: { flexDirection:'row', justifyContent:'flex-end', marginTop:20 },
  preview:      { width:'100%', height:150, resizeMode:'contain', marginVertical:10 },
});
