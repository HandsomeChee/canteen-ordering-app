// screens/MenuItemModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { getImageSource } from '../utils/getImageSource';
import styles from '../styles/MenuStyle';

const { height } = Dimensions.get('window');

const MenuItemModal = ({ visible, item, onClose, onAddToCart }:any) => {
  const translateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY }] },
          ]}>
          <View style={styles.handleBar} />
          <Image source={getImageSource(item.image)} style={styles.modalImage} />
          <View style={styles.modalContent}>
            <Text style={styles.modalName}>{item.name}</Text>
            <Text style={styles.modalDescription}>{item.description}</Text>
            <Text style={styles.modalPrice}>RM {item.price.toFixed(2)}</Text>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                onAddToCart(item);
                onClose();
              }}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
              <Ionicon name="cart" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MenuItemModal;