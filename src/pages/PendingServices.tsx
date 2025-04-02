// src/pages/PendingServices.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  CarFront, 
  ArrowDownUp, 
  Plus,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader,
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import ServiceCard, { ServiceStatus } from '@/components/ServiceCard';
import AddServiceForm from '@/components/AddServiceForm';
import AssignServiceDialog from '@/components/AssignServiceDialog';
import { toast } from 'sonner';

// Importar funciones de API
import { 
  getAllPendingServices, 
  getServicesByStatus, 
  searchPendingServices,
  assignServiceToEmployee,
  markServiceAsComplete,
  PendingService
} from '@/api/pendingServiceApi';

const PendingServices = () => {
  // Estado
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderBy, setOrderBy] = useState<string>('entry_time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [serviceToAssign, setServiceToAssign] = useState<PendingService | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  
  // Query client para invalidar queries
  const queryClient = useQueryClient();

  // Query para obtener servicios
  const { 
    data: services = [], 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['pendingServices', statusFilter],
    queryFn: async () => {
      console.log('Fetching with status filter:', statusFilter); // Para depuración
      if (statusFilter === 'all') {
        return getAllPendingServices();
      } else {
        return getServicesByStatus(statusFilter);
      }
    }
  });

  // Query para búsqueda (se ejecuta solo si hay término de búsqueda)
const { 
  data: searchResults = [],
  isLoading: isSearching
} = useQuery({
  queryKey: ['pendingServicesSearch', searchTerm],
  queryFn: () => searchPendingServices(searchTerm),
  enabled: searchTerm.length > 2, // Solo buscar si hay al menos 3 caracteres
  placeholderData: previousData => previousData
});

  // Mutación para asignar servicio a empleado
  const assignMutation = useMutation({
    mutationFn: ({ serviceId, employeeId }: { serviceId: number, employeeId: number }) => 
      assignServiceToEmployee(serviceId, employeeId),
    onSuccess: () => {
      toast.success('Servicio asignado correctamente');
      queryClient.invalidateQueries({ queryKey: ['pendingServices'] });
      setAssignDialogOpen(false);
    },
    onError: () => {
      toast.error('Error al asignar el servicio');
    }
  });

  // Mutación para marcar servicio como completado
  const completeMutation = useMutation({
    mutationFn: (serviceId: number) => markServiceAsComplete(serviceId),
    onSuccess: () => {
      toast.success('Servicio marcado como completado');
      queryClient.invalidateQueries({ queryKey: ['pendingServices'] });
    },
    onError: () => {
      toast.error('Error al completar el servicio');
    }
  });

  // Determinar qué lista de servicios usar
  const servicesList = searchTerm.length > 2 ? searchResults : services;

  // Filtrar servicios por estado si estamos en vista de "todos"
  const filteredServices = statusFilter === 'all' && !searchTerm 
    ? servicesList.filter(service => 
        service.status === 'pending' || 
        service.status === 'in-progress' || 
        service.status === 'delayed'
      )
    : servicesList;

  // Ordenar servicios
  const sortedServices = [...filteredServices].sort((a, b) => {
    let valueA, valueB;
    
    if (orderBy === 'entry_time') {
      valueA = new Date(a.entry_time).getTime();
      valueB = new Date(b.entry_time).getTime();
    } else if (orderBy === 'estimated_completion_time') {
      valueA = new Date(a.estimated_completion_time).getTime();
      valueB = new Date(b.estimated_completion_time).getTime();
    } else if (orderBy === 'license_plate') {
      valueA = a.license_plate || '';
      valueB = b.license_plate || '';
    } else {
      valueA = a[orderBy as keyof PendingService];
      valueB = b[orderBy as keyof PendingService];
    }
    
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Handlers
  const handleMarkComplete = (id: string) => {
    completeMutation.mutate(Number(id));
  };

  const handleAssignClick = (service: PendingService) => {
    setServiceToAssign(service);
    setAssignDialogOpen(true);
  };

  const handleAssignService = (employeeId: string, employeeName: string) => {
    if (!serviceToAssign || !serviceToAssign.service_id) return;
    
    assignMutation.mutate({
      serviceId: serviceToAssign.service_id, 
      employeeId: Number(employeeId)
    });
  };

  const handleAddServiceSuccess = () => {
    setAddServiceOpen(false);
    queryClient.invalidateQueries({ queryKey: ['pendingServices'] });
    toast.success('Servicio agregado correctamente');
  };

  const handleSort = (field: string) => {
    if (orderBy === field) {
      // Si ya estamos ordenando por este campo, cambiamos la dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un nuevo campo, ordenamos ascendente
      setOrderBy(field);
      setSortDirection('asc');
    }
  };

  // Adaptar servicios al formato esperado por ServiceCard
  const adaptService = (service: PendingService) => ({
    id: service.service_id?.toString() || '',
    licensePlate: service.license_plate || '',
    vehicleType: `${service.make} ${service.model}`,
    clientName: service.client_name || '',
    serviceType: service.service_type_name || '',
    entryTime: new Date(service.entry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    estimatedTime: new Date(service.estimated_completion_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    assignedTo: service.employee_name,
    status: service.status as ServiceStatus
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servicios Pendientes</h1>
          <p className="text-muted-foreground mt-1">
            Gestione los vehículos en proceso de lavado
          </p>
        </div>
        
        <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
              <DialogDescription>
                Registre un nuevo servicio para un vehículo entrante
              </DialogDescription>
            </DialogHeader>
            <AddServiceForm onSuccess={handleAddServiceSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-auto grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por placa o cliente"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
        <Select 
  value={statusFilter} 
  onValueChange={(value) => {
    setStatusFilter(value);
    // Invalidar la consulta actual para forzar una recarga
    queryClient.invalidateQueries({ 
      queryKey: ['pendingServices'] 
    });
  }}
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filtrar por estado" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Todos los estados</SelectItem>
    <SelectItem value="pending">Pendiente</SelectItem>
    <SelectItem value="in-progress">En proceso</SelectItem>
    <SelectItem value="delayed">Retrasado</SelectItem>
    <SelectItem value="completed">Completado</SelectItem>
  </SelectContent>
</Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSort('entry_time')}>
                Hora de entrada {orderBy === 'entry_time' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('estimated_completion_time')}>
                Tiempo estimado {orderBy === 'estimated_completion_time' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('license_plate')}>
                Placa {orderBy === 'license_plate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Estado de carga */}
      {isLoading || isSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">Error al cargar los servicios</h3>
          <p className="mt-1 text-muted-foreground mb-4">
            No pudimos obtener los servicios pendientes. Por favor, intente nuevamente.
          </p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      ) : sortedServices.length === 0 ? (
        <div className="text-center py-10">
          <CarFront className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No hay servicios que coincidan con tu búsqueda</h3>
          <p className="mt-1 text-muted-foreground">Prueba con diferentes filtros o términos de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedServices.map((service) => (
            <ServiceCard 
              key={service.service_id}
              {...adaptService(service)}
              onMarkComplete={handleMarkComplete}
              onAssign={() => handleAssignClick(service)}
            />
          ))}
        </div>
      )}
      
      {/* Diálogo para asignar servicio */}
      <AssignServiceDialog 
        open={assignDialogOpen} 
        onOpenChange={setAssignDialogOpen} 
        service={serviceToAssign ? adaptService(serviceToAssign) : null}
        onAssign={handleAssignService}
      />
    </div>
  );
};

export default PendingServices;