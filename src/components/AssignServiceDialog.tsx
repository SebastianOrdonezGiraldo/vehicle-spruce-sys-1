// src/components/AssignServiceDialog.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CarFront, Hourglass } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceStatus } from './ServiceCard';
import { getAllEmployees } from '@/api/employeeApi';

// Interfaz para el servicio
interface Service {
  id: string;
  licensePlate: string;
  vehicleType: string;
  clientName: string;
  serviceType: string;
  entryTime: string;
  estimatedTime: string;
  assignedTo?: string;
  status: ServiceStatus;
}

// Interfaz para empleado
interface Employee {
  employee_id: number;
  name: string;
  position: string;
  status: string;
  workload?: number;  // Carga de trabajo actual (simulada)
}

interface AssignServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onAssign: (employeeId: string, employeeName: string) => void;
}

const AssignServiceDialog: React.FC<AssignServiceDialogProps> = ({
  open,
  onOpenChange,
  service,
  onAssign
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Fetch empleados activos
  // Fetch empleados activos
const { 
  data: employees = [], 
  isLoading, 
  isError 
} = useQuery({
  queryKey: ['employees'],
  queryFn: getAllEmployees,
  select: (data) => {
    // Filtramos empleados activos y simulamos carga de trabajo
    // Definir tipo explícito para la función de filter
    const activeEmployees = data.filter((employee: Employee) => employee.status === 'active');
    
    // Definir tipo explícito para la función de map
    return activeEmployees.map((employee: Employee) => ({
      ...employee,
      workload: Math.floor(Math.random() * 100) // Valor aleatorio entre 0-100%
    }));
  },
  enabled: open // Solo cargar cuando el diálogo está abierto
});

  const handleAssign = (employeeId: string, employeeName: string) => {
    setIsAssigning(true);
    
    // Simulamos un pequeño retraso
    setTimeout(() => {
      onAssign(employeeId, employeeName);
      setIsAssigning(false);
    }, 500);
  };

  // Función para determinar el color de carga de trabajo
  const getWorkloadColor = (workload: number) => {
    if (workload < 30) return "bg-green-100 text-green-800";
    if (workload < 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Servicio</DialogTitle>
          <DialogDescription>
            Seleccione un empleado para asignar el servicio
          </DialogDescription>
        </DialogHeader>
        
        {/* Información del servicio */}
        {service && (
          <div className="mb-4 p-3 rounded-md border">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium flex items-center">
                <CarFront className="h-4 w-4 mr-2" />
                {service.licensePlate}
              </div>
              <Badge variant="outline">{service.vehicleType}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">{service.clientName}</div>
            <div className="text-sm font-medium mt-2">{service.serviceType}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Hourglass className="h-3 w-3 mr-1" />
              Entrada: {service.entryTime} | Estimado: {service.estimatedTime}
            </div>
          </div>
        )}
        
        {/* Lista de empleados */}
        <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
          {isLoading ? (
            // Estado de carga
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-md border animate-pulse">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="ml-3">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded mt-2" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-muted rounded" />
              </div>
            ))
          ) : isError ? (
            // Error al cargar
            <div className="text-center p-4 text-destructive">
              Error al cargar empleados. Intente nuevamente.
            </div>
          ) : employees.length === 0 ? (
            // Sin empleados activos
            <div className="text-center p-4 text-muted-foreground">
              No hay empleados activos disponibles.
            </div>
          ) : (
            // Lista de empleados
            employees.map((employee: Employee) => (
              <div 
                key={employee.employee_id}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback>
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.position}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {employee.workload !== undefined && (
                    <Badge 
                      variant="outline" 
                      className={getWorkloadColor(employee.workload)}
                    >
                      {employee.workload}% ocupado
                    </Badge>
                  )}
                  <Button 
                    size="sm"
                    onClick={() => handleAssign(employee.employee_id.toString(), employee.name)}
                    disabled={isAssigning}
                  >
                    Asignar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignServiceDialog;