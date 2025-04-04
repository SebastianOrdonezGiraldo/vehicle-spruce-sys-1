// src/api/serviceRatingApi.ts
import api from './api';

export interface ServiceRating {
  id?: number;
  service_id: number;
  wait_time_rating: number;
  staff_friendliness_rating: number;
  service_quality_rating: number;
  customer_comment?: string;
  created_at?: string;
}

export interface ServiceRatingReport {
  avg_wait_time: number;
  avg_staff_friendliness: number;
  avg_service_quality: number;
  total_ratings: number;
}

export const rateService = async (serviceId: number, ratingData: Omit<ServiceRating, 'id' | 'created_at'>) => {
  try {
    const response = await api.post(`/service-ratings/${serviceId}`, ratingData);
    return response.data;
  } catch (error) {
    console.error('Error al calificar servicio:', error);
    throw error;
  }
};

export const getServiceRatingReport = async () => {
  try {
    const response = await api.get('/service-ratings/report');
    return response.data as ServiceRatingReport;
  } catch (error) {
    console.error('Error al obtener reporte de calificaciones:', error);
    throw error;
  }
};

export const getServiceRatings = async (serviceId: number) => {
  try {
    const response = await api.get(`/service-ratings/${serviceId}/ratings`);
    return response.data as ServiceRating[];
  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    throw error;
  }
};