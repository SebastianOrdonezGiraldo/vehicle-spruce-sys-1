// src/api/employeeApi.ts
import api from './api';

export interface Employee {
  employee_id?: number;
  name: string;
  position: string;
  email?: string | null;
  phone?: string | null;
  hire_date: string;
  status: 'active' | 'inactive';
}

// Obtener todos los empleados
export const getAllEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
};

// Obtener empleado por ID
export const getEmployeeById = async (id: number) => {
  try {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener empleado con id ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo empleado
export const createEmployee = async (employeeData: Employee) => {
  try {
    const response = await api.post('/employees', {
      name: employeeData.name,
      position: employeeData.position,
      email: employeeData.email || null,
      phone: employeeData.phone || null,
      hire_date: employeeData.hire_date,
      status: employeeData.status
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear empleado:', error);
    throw error;
  }
};

// Actualizar un empleado
export const updateEmployee = async (id: number, employeeData: Partial<Employee>) => {
  try {
    const response = await api.put(`/employees/${id}`, {
      ...employeeData,
      email: employeeData.email || null,
      phone: employeeData.phone || null
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar empleado con id ${id}:`, error);
    throw error;
  }
};

// Eliminar un empleado
export const deleteEmployee = async (id: number) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar empleado con id ${id}:`, error);
    throw error;
  }
};