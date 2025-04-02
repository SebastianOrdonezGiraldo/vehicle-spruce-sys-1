// src/api/inventoryApi.ts
import api from './api';

// Interfaces
export interface InventoryItem {
  item_id?: number;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unit: string;
  cost_price: number;
  selling_price: number;
  reorder_level: number;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryUsage {
  usage_id?: number;
  item_id: number;
  service_id?: number;
  quantity: number;
  employee_id?: number;
  usage_date: string | Date;
  notes?: string;
  created_at?: string;
  // Relations
  item_name?: string;
  employee_name?: string;
  service_name?: string;
}

// Get all inventory items
export const getAllInventoryItems = async () => {
  try {
    const response = await api.get('/inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

// Get a single inventory item by ID
export const getInventoryItemById = async (id: number) => {
  try {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching inventory item with id ${id}:`, error);
    throw error;
  }
};

// Get low stock items
export const getLowStockItems = async () => {
  try {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    throw error;
  }
};

// Get items by category
export const getItemsByCategory = async (category: string) => {
  try {
    const response = await api.get(`/inventory/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching items by category ${category}:`, error);
    throw error;
  }
};

// Search inventory items
export const searchInventoryItems = async (term: string) => {
  try {
    const response = await api.get(`/inventory/search/${term}`);
    return response.data;
  } catch (error) {
    console.error('Error searching inventory items:', error);
    throw error;
  }
};

// Create a new inventory item
export const createInventoryItem = async (itemData: InventoryItem) => {
  try {
    const response = await api.post('/inventory', itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

// Update an inventory item
export const updateInventoryItem = async (id: number, itemData: Partial<InventoryItem>) => {
  try {
    const response = await api.put(`/inventory/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error(`Error updating inventory item with id ${id}:`, error);
    throw error;
  }
};

// Adjust inventory quantity
export const adjustInventoryQuantity = async (id: number, adjustment: number) => {
  try {
    const response = await api.patch(`/inventory/${id}/quantity`, { adjustment });
    return response.data;
  } catch (error) {
    console.error(`Error adjusting inventory quantity for item ${id}:`, error);
    throw error;
  }
};

// Delete an inventory item
export const deleteInventoryItem = async (id: number) => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting inventory item with id ${id}:`, error);
    throw error;
  }
};

// Record inventory usage
export const recordInventoryUsage = async (usageData: Partial<InventoryUsage>) => {
  try {
    const response = await api.post('/inventory/usage', usageData);
    return response.data;
  } catch (error) {
    console.error('Error recording inventory usage:', error);
    throw error;
  }
};

// Get usage history for an item
export const getInventoryUsageHistory = async (id: number) => {
  try {
    const response = await api.get(`/inventory/${id}/usage`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching usage history for item ${id}:`, error);
    throw error;
  }
};

// Get all inventory usage records
export const getAllInventoryUsage = async (limit: number = 100) => {
  try {
    const response = await api.get(`/inventory/usage?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory usage records:', error);
    throw error;
  }
};

// Get all inventory categories
export const getAllCategories = async () => {
  try {
    const response = await api.get('/inventory/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory categories:', error);
    throw error;
  }
};