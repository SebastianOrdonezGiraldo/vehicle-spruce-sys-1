// src/api/customerApi.ts
import api from './api';

// Interfaz para el cliente
export interface Customer {
  customer_id?: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

// Obtener todos los clientes
export const getAllCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

// Obtener un cliente por ID
export const getCustomerById = async (id: number) => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo cliente
export const createCustomer = async (customerData: Customer) => {
  try {
    const response = await api.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
};

// Actualizar un cliente
export const updateCustomer = async (id: number, customerData: Partial<Customer>) => {
  try {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar cliente con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un cliente
export const deleteCustomer = async (id: number) => {
  try {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar cliente con id ${id}:`, error);
    throw error;
  }
};