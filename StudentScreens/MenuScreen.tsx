import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { debounce } from 'lodash';
import { initializeMenuData,getDBConnection, createTableMenu, getMenuItems } from '../services/db-service';
import { syncRemoteMenuToLocal } from '../services/sync-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import MenuItemModal from '../components/MenuItemModal';
import styles from '../styles/MenuStyle';
import { useCart } from '../context/CartContext';
import socket, { connectSocket } from '../src/socket';
import { getImageSource } from '../utils/getImageSource';

const MenuScreen = () => {
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { addToCart } = useCart();

  const categories = ['All', 'Rice', 'Noodle', 'Drinks', 'Dessert', 'Snacks'];
  const categoryIcons = {
    All: 'dots-grid',
    Rice: 'rice',
    Noodle: 'noodles',
    Drinks: 'coffee-outline',
    Dessert: 'cookie-outline',
    Snacks: 'food-drumstick-outline'
  };
  const categoryIconsActive = {
    All: 'dots-grid',
    Rice: 'rice',
    Noodle: 'noodles',
    Drinks: 'coffee',
    Dessert: 'cookie',
    Snacks: 'food-drumstick',
  };

  // Load local data from SQLite
  const loadLocalMenu = useCallback(async () => {
    const db = await getDBConnection();
    await createTableMenu(db);
    await initializeMenuData(db); 
    const items = await getMenuItems(db);
    setMenu(items);
  }, []);

  useEffect(() => {
    loadLocalMenu();
    connectSocket();

    // Listen for backend menu updates
    socket.on('menuUpdated', async () => {
      console.log('[Socket] menuUpdated received, syncing...');
      const synced = await syncRemoteMenuToLocal();
      if (synced) {
        await loadLocalMenu();
        Toast.show({ type: 'success', text1: 'Menu updated' });
      }
    });

    // Fallback sync every 2 seconds
    const interval = setInterval(async () => {
      const synced = await syncRemoteMenuToLocal();
      if (synced) await loadLocalMenu();
    }, 10000);

    return () => {
      clearInterval(interval);
      socket.off('menuUpdated');
    };
  }, [loadLocalMenu]);

  
  // Search input handler with debounce
  const handleSearch = useCallback(
    debounce((text) => {
      setSearchText(text);
    }, 300),
    []
  );

  // Filter menu by category and search
  const filteredMenu = menu.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Render each food item
  const renderItem = ({ item }:any) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <Image
          source={getImageSource(item.image)}
          style={styles.image}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => {
          addToCart({ ...item, quantity: 1 });
          Toast.show({
            type: 'success',
            text1: 'Added to cart',
            text2: `${item.name} was added to your cart`,
            position: 'bottom',
            visibilityTime: 2000,
          });
        }}
      >
        <Ionicon name="add" size={22} color="#435861" />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>RM {parseFloat(item.price).toFixed(2)}</Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Category buttons */}
      <View style={styles.categoryRow}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton, 
                selectedCategory === cat && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <View style={styles.categoryContent}>
                <Icon 
                  name={
                    selectedCategory === cat 
                      ? categoryIconsActive[cat] 
                      : categoryIcons[cat]
                  } 
                  size={18} 
                  color={
                    selectedCategory === cat 
                      ? styles.selectedCategoryText.color 
                      : styles.categoryText.color
                  } 
                  style={styles.categoryIcon}
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.selectedCategoryText
                ]}>
                  {cat}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search"
        defaultValue={searchText}
        onChangeText={handleSearch} // Debounce the search input to avoid too many re-renders
      />

      {/* Menu List */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: 5 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />

      {/* Menu Item Modal */}
      <MenuItemModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        onAddToCart={(item) => {
          addToCart({ ...item, quantity: 1 });
          Toast.show({
            type: 'success',
            text1: 'Added to cart',
            text2: `${item.name} was added to your cart`,
            position: 'bottom',
            visibilityTime: 2000
          });
        }}
      />
    </View>
  );
};

export default MenuScreen;