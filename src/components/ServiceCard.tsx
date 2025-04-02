// src/components/ServiceCard.tsx
import React from 'react';
import { CarFront, Clock, User, Check, AlertCircle, Hourglass } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export type ServiceStatus = 'pending' | 'in-progress' | 'completed' | 'delayed';

interface ServiceCardProps {
  id: string;
  licensePlate: string;
  vehicleType: string;
  clientName: string;
  serviceType: string;
  entryTime: string;
  estimatedTime?: string; // Hacer este campo opcional
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  onMarkComplete?: (id: string) => void;
  onAssign?: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  licensePlate,
  vehicleType,
  clientName,
  serviceType,
  entryTime,
  estimatedTime,
  assignedTo,
  status,
  onMarkComplete,
  onAssign,
}) => {
  // Calcular tiempo transcurrido como porcentaje
  const calculateProgress = () => {
    if (status === 'completed') return 100;
    if (status === 'pending') return 0;
    
    // Para servicios en progreso o retrasados, calculamos el progreso basado en el tiempo transcurrido
    try {
      // Convertir strings de hora a objetos Date para hoy
      const now = new Date();
      const today = new Date().setHours(0, 0, 0, 0);
      
      // Parse entry and estimated times in format "HH:MM"
      const [entryHour, entryMinute] = entryTime.split(':').map(Number);
      const [estHour, estMinute] = estimatedTime.split(':').map(Number);
      
      const entryDate = new Date(today);
      entryDate.setHours(entryHour, entryMinute, 0);
      
      const estDate = new Date(today);
      estDate.setHours(estHour, estMinute, 0);
      
      // Si la hora estimada es menor que la hora de entrada, asumimos que es para el día siguiente
      if (estDate < entryDate) {
        estDate.setDate(estDate.getDate() + 1);
      }
      
      // Calcular tiempo total y tiempo transcurrido
      const totalTime = estDate.getTime() - entryDate.getTime();
      const elapsedTime = now.getTime() - entryDate.getTime();
      
      // Calcular progreso
      let progress = Math.round((elapsedTime / totalTime) * 100);
      
      // Limitar progreso entre 0 y 100
      progress = Math.max(0, Math.min(progress, 100));
      
      return progress;
    } catch (error) {
      // Si hay un error en el cálculo, devolver un valor por defecto
      console.error('Error calculating progress:', error);
      return status === 'in-progress' ? 50 : 80;
    }
  };
  
  const progress = calculateProgress();
  
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">En proceso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completado</Badge>;
      case 'delayed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Retrasado</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold">{licensePlate}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground">{serviceType}</p>
          </div>
          {status === 'delayed' && (
            <div className="text-destructive">
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CarFront size={16} className="mr-2 text-muted-foreground" />
            <span>{vehicleType}</span>
          </div>
          <div className="flex items-center text-sm">
            <User size={16} className="mr-2 text-muted-foreground" />
            <span>{clientName}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2 text-muted-foreground" />
            <span>Entrada: {entryTime} | Estimado: {estimatedTime}</span>
          </div>
          {assignedTo && (
            <div className="flex items-center text-sm">
              <User size={16} className="mr-2 text-muted-foreground" />
              <span>Asignado a: {assignedTo}</span>
            </div>
          )}
          
          {/* Barra de progreso para servicios en proceso */}
          {(status === 'in-progress' || status === 'delayed') && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center">
                  <Hourglass className="h-3 w-3 mr-1" />
                  Progreso
                </span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className={status === 'delayed' ? "bg-red-100" : undefined} 
              />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
        {status !== 'completed' && !assignedTo && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAssign && onAssign(id)}
          >
            Asignar
          </Button>
        )}
        {status === 'in-progress' && (
          <Button 
            size="sm" 
            onClick={() => onMarkComplete && onMarkComplete(id)}
          >
            <Check size={16} className="mr-1" />
            Completar
          </Button>
        )}
        {status === 'delayed' && (
          <Button 
            size="sm"
            variant="destructive"
            onClick={() => onMarkComplete && onMarkComplete(id)}
          >
            <Check size={16} className="mr-1" />
            Completar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;