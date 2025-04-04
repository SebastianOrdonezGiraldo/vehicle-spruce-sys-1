// src/api/pendingServiceApi.ts
import api from './api';

export interface PendingService {
  service_id?: number;
  vehicle_id: number;
  service_type_id: number;
  employee_id?: number | null;
  client_name?: string;
  license_plate?: string;
  vehicle_type?: string;
  entry_time: string | Date;
  estimated_completion_time: string | Date;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  notes?: string;
  // Campos adicionales que vienen de relaciones
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  client_phone?: string;
  service_type_name?: string;
  service_price?: number;
  service_hours?: number;
  employee_name?: string;
  employee_position?: string;
}

// Interfaz para respuesta de completar servicio con enlace de calificación
export interface CompleteServiceResponse {
  service: PendingService;
  ratingLink?: string;
  ratingUrl?: string;
}

// Obtener todos los servicios pendientes
export const getAllPendingServices = async () => {
  try {
    const response = await api.get('/pending-services');
    return response.data as PendingService[];
  } catch (error) {
    console.error('Error al obtener servicios pendientes:', error);
    throw error;
  }
};

// Obtener un servicio por ID
export const getPendingServiceById = async (id: number) => {
  try {
    const response = await api.get(`/pending-services/${id}`);
    return response.data as PendingService;
  } catch (error) {
    console.error(`Error al obtener servicio pendiente con id ${id}:`, error);
    throw error;
  }
};

// Obtener servicios por estado
export const getServicesByStatus = async (status: string) => {
  try {
    const response = await api.get(`/pending-services/status/${status}`);
    return response.data as PendingService[];
  } catch (error) {
    console.error(`Error al obtener servicios con estado ${status}:`, error);
    throw error;
  }
};

// Buscar servicios
export const searchPendingServices = async (term: string) => {
  try {
    const response = await api.get(`/pending-services/search/${term}`);
    return response.data as PendingService[];
  } catch (error) {
    console.error('Error al buscar servicios pendientes:', error);
    throw error;
  }
};

// Crear un nuevo servicio
export const createPendingService = async (serviceData: Partial<PendingService>) => {
  try {
    const response = await api.post('/pending-services', serviceData);
    return response.data as PendingService;
  } catch (error) {
    console.error('Error al crear servicio pendiente:', error);
    throw error;
  }
};

// Actualizar un servicio
export const updatePendingService = async (id: number, serviceData: Partial<PendingService>) => {
  try {
    const response = await api.put(`/pending-services/${id}`, serviceData);
    return response.data as PendingService;
  } catch (error) {
    console.error(`Error al actualizar servicio pendiente con id ${id}:`, error);
    throw error;
  }
};

// Asignar servicio a un empleado
export const assignServiceToEmployee = async (serviceId: number, employeeId: number) => {
  try {
    const response = await api.patch(`/pending-services/${serviceId}/assign`, { employee_id: employeeId });
    return response.data as PendingService;
  } catch (error) {
    console.error('Error asignando servicio:', error);
    throw error;
  }
};

// Marcar servicio como completado con generación de enlace de calificación
export const markServiceAsComplete = async (serviceId: number) => {
  try {
    const response = await api.patch(`/pending-services/${serviceId}/complete`);
    return response.data as CompleteServiceResponse;
  } catch (error) {
    console.error('Error completando servicio:', error);
    throw error;
  }
};

// Eliminar un servicio
export const deletePendingService = async (id: number) => {
  try {
    const response = await api.delete(`/pending-services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar servicio pendiente con id ${id}:`, error);
    throw error;
  }
};