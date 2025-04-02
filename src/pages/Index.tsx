import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CarFront, 
  Users, 
  Clock, 
  DollarSign, 
  Package,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import { getDashboardStats, PendingService } from '@/api/dashboardApi';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  assignServiceToEmployee, 
  markServiceAsComplete 
} from '@/api/pendingServiceApi';

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { 
    data: stats, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 60000 // Refrescar cada minuto
  });

  const quickStats = [
    { 
      title: 'Vehículos Pendientes', 
      value: stats?.pendingVehicles || 0, 
      icon: CarFront 
    },
    { 
      title: 'Empleados Activos', 
      value: stats?.activeEmployees || 0, 
      icon: Users 
    },
    { 
      title: 'Tiempo Promedio', 
      value: `${stats?.avgServiceTime || 0} min`, 
      icon: Clock 
    },
    { 
      title: 'Ingresos del Día', 
      value: `$${stats?.dailyIncome || 0}`, 
      icon: DollarSign 
    },
  ];

  if (isLoading) return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );

  if (isError) return (
    <div className="text-center py-10">
      <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold">Error al cargar estadísticas</h2>
      <p className="text-muted-foreground">No se pudieron obtener los datos del dashboard</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general del estado de tu centro de lavado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Servicios Pendientes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Servicios Pendientes</h2>
            <Button variant="outline" asChild>
              <Link to="/pending-services">Ver todos</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.pendingServices.slice(0, 2).map((service: PendingService) => (
              <div key={service.service_id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{service.license_plate}</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    En proceso
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{service.service_name}</p>
                <div className="mt-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CarFront className="h-4 w-4 text-muted-foreground" />
                    <span>{service.make} {service.model}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{service.client_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Entrada: {new Date(service.entry_time).toLocaleTimeString()} | 
                      Estimado: No estimado
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm">Asignar</Button>
                  <Button size="sm">Completar</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventario Bajo */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.lowStockItems.map((item: { name: string; quantity: number; reorder_level: number }) => (
              <div 
                key={item.name} 
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <Package className="text-red-600" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {item.quantity} / {item.reorder_level}
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" asChild>
                  <Link to="/inventory">Reponer</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;