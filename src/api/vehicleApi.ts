// src/api/vehicleApi.ts
import api from './api';

// Interfaz para el vehículo
export interface Vehicle {
  vehicle_id?: number;
  customer_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin?: string;
  color?: string;
  last_service_date?: string;
}

// Obtener todos los vehículos
export const getAllVehicles = async () => {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    throw error;
  }
};

// Crear un nuevo vehículo
export const createVehicle = async (vehicleData) => {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      throw error;
    }
  };

// Actualizar un vehículo
export const updateVehicle = async (id: number, vehicleData: Partial<Vehicle>) => {
  try {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar vehículo con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un vehículo
export const deleteVehicle = async (id: number) => {
  try {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar vehículo con id ${id}:`, error);
    throw error;
  }
};