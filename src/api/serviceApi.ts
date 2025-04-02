// src/api/serviceApi.ts
import api from './api';

// Interfaz para el servicio
export interface Service {
  service_id: number;
  name: string;
  description?: string;
  base_price: number;
  estimated_hours?: number;
  category_id?: number;
  category_name?: string;
  created_at?: string;
  updated_at?: string;
}

// Obtener todos los servicios
export const getAllServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
};

// Obtener un servicio por ID
export const getServiceById = async (id: number) => {
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener servicio con id ${id}:`, error);
    throw error;
  }
};

// Obtener servicios por categoría
export const getServicesByCategory = async (categoryId: number) => {
  try {
    const response = await api.get(`/services/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener servicios de la categoría ${categoryId}:`, error);
    throw error;
  }
};

// Obtener todas las categorías de servicios
export const getAllServiceCategories = async () => {
  try {
    const response = await api.get('/services/categories');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías de servicios:', error);
    throw error;
  }
};

// Crear un nuevo servicio
export const createService = async (serviceData: Partial<Service>) => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error al crear servicio:', error);
    throw error;
  }
};

// Actualizar un servicio
export const updateService = async (id: number, serviceData: Partial<Service>) => {
  try {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar servicio con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un servicio
export const deleteService = async (id: number) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar servicio con id ${id}:`, error);
    throw error;
  }
};

// Crear una nueva categoría de servicio
export const createServiceCategory = async (name: string, description?: string) => {
  try {
    const response = await api.post('/services/categories', { name, description });
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría de servicio:', error);
    throw error;
  }
};