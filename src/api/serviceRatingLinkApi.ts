// src/api/serviceRatingLinkApi.ts
import api from './api';

export interface ServiceRatingLinkValidation {
  serviceId: number;
  vehicleMake: string;
  vehicleModel: string;
  licensePlate: string;
}

export interface ServiceRatingLinkGeneration {
  token: string;
  ratingUrl: string;
}

export const generateServiceRatingLink = async (serviceId: number) => {
  try {
    const response = await api.post(`/service-rating-links/${serviceId}/generate-link`);
    return response.data as ServiceRatingLinkGeneration;
  } catch (error) {
    console.error('Error al generar enlace de calificación:', error);
    throw error;
  }
};

export const validateServiceRatingLink = async (token: string) => {
  try {
    const response = await api.get(`/service-rating-links/validate/${token}`);
    return response.data as ServiceRatingLinkValidation;
  } catch (error) {
    console.error('Error al validar enlace de calificación:', error);
    throw error;
  }
};