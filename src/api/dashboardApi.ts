import api from './api';

export interface PendingService {
  service_id: number;
  license_plate: string;
  make: string;
  model: string;
  service_name: string;
  client_name: string;
  status: string;
  entry_time: string;
  estimated_completion_time?: string; // Añade este campo
}

export interface LowStockItem {
  name: string;
  quantity: number;
  reorder_level: number;
}

export interface DashboardStats {
  pendingVehicles: number;
  activeEmployees: number;
  avgServiceTime: number;
  dailyIncome: number;
  pendingServices: PendingService[];
  lowStockItems: LowStockItem[];
}

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data as DashboardStats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};