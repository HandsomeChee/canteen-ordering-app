import axios from 'axios';
import { Platform } from 'react-native';

// API base URL
export const API_BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000/api'
  : 'http://localhost:3000/api';

const apiClient = axios.create({ baseURL: API_BASE_URL });

export interface MenuItem {
  id: number | string;
  name: string;
  category?: string;
  price: number;
  description?: string;
  imageKey?: string;
}

export interface Order {
  id: number | string;
  studentId: string;
  status: string;
}

// --- Menu APIs ---

// Get all menu items
export const fetchMenu = async (): Promise<MenuItem[]> => {
  const resp = await apiClient.get<MenuItem[]>('/menu');
  return resp.data.map(item => ({
    ...item,
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
  }));
};

// Add new menu item (with or without image)
export const addMenuItem = async (item: {
  name: string;
  category?: string;
  price: number;
  description?: string;
  imageKey?: string;
  image?: { uri: string; type?: string; name: string };
}): Promise<MenuItem> => {
  const formData = new FormData();
  formData.append('name', item.name);
  if (item.category) formData.append('category', item.category);
  formData.append('price', String(item.price));
  if (item.description) formData.append('description', item.description);
  if (item.imageKey) {
    formData.append('imageKey', item.imageKey);
  } else if (item.image) {
    formData.append('image', {
      uri: item.image.uri,
      name: item.image.name,
      type: item.image.type || 'image/jpeg',
    } as any);
  } else {
    throw new Error('Need imageKey or image file');
  }

  const resp = await fetch(`${API_BASE_URL}/menu`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  return { ...data, price: parseFloat(data.price) };
};

// Update menu (only fields, no image upload)
export const updateMenuItem = async (
  id: number | string,
  item: {
    name: string;
    category?: string;
    price: number;
    description?: string;
    imageKey: string;
  }
): Promise<void> => {
  await apiClient.put(`/menu/${id}`, {
    name: item.name,
    category: item.category,
    price: String(item.price),
    description: item.description,
    imageKey: item.imageKey,
  });
};

// Update menu with new image upload
export const updateMenuItemWithImage = async (
  id: number | string,
  item: {
    name: string;
    category?: string;
    price: number;
    description?: string;
    imageKey?: string;
    image?: { uri: string; type?: string; name: string };
  }
): Promise<void> => {
  const formData = new FormData();
  formData.append('name', item.name);
  if (item.category) formData.append('category', item.category);
  formData.append('price', String(item.price));
  if (item.description) formData.append('description', item.description);

  if (item.image) {
    formData.append('image', {
      uri: item.image.uri,
      name: item.image.name,
      type: item.image.type || 'image/jpeg'
    } as any);
  } else if (item.imageKey) {
    formData.append('imageKey', item.imageKey);
  } else {
    throw new Error('Need image or imageKey for update');
  }

  const resp = await fetch(`${API_BASE_URL}/menu/${id}`, {
    method: 'PUT',
    body: formData
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${txt}`);
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: number | string): Promise<void> => {
  await apiClient.delete(`/menu/${id}`);
};

// --- Order APIs ---

// Get all orders
export const fetchOrders = async (): Promise<Order[]> => {
  const resp = await apiClient.get<Order[]>('/orders');
  return resp.data;
};

// Update an order's status
export const updateOrderStatus = async (
  id: number | string,
  status: string
): Promise<void> => {
  try {
    const resp = await apiClient.put(`/orders/${id}`, { status });

    if (resp.status !== 200) {
      throw new Error(`Unexpected response status: ${resp.status}`);
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`[updateOrderStatus] ${status}:`, data);
      throw new Error(data?.error || `Failed to update status (HTTP ${status})`);
    } else {
      console.error('[updateOrderStatus] Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }
  }
};

// Place an order
export const placeOrder = async (studentId: string): Promise<Order> => {
  try {
    console.log('[placeOrder] Sending studentId:', studentId); // Debug log
    const resp = await apiClient.post('/orders', { studentId });
    return resp.data;
  } catch (error: any) {
    console.error('[placeOrder] Error:', error.response?.data || error.message);
    throw new Error(error?.response?.data?.error || 'Unable to place order');
  }
};
