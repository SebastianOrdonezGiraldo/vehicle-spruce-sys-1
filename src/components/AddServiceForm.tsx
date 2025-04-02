// src/components/AddServiceForm.tsx
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CarFront, User, Calendar, Clock, Check, Search } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Importaciones para APIs
import { getAllVehicles } from '@/api/vehicleApi';
import { getAllEmployees } from '@/api/employeeApi';
import { getAllServices } from '@/api/serviceApi';
import { PendingService, createPendingService } from '@/api/pendingServiceApi';

// Define interfaces
interface Vehicle {
  vehicle_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color?: string;
  customer_name?: string;
  customer_id?: number;
}

interface Employee {
  employee_id: number;
  name: string;
  position: string;
  status: string;
}

interface Service {
  service_id: number;
  name: string;
  description?: string;
  base_price: number;
  estimated_hours?: number;
  category_id?: number;
  category_name?: string;
}

// Esquema de validación
const serviceFormSchema = z.object({
  vehicleId: z.string({
    required_error: "Seleccione un vehículo",
  }),
  serviceTypeId: z.string({
    required_error: "Seleccione un tipo de servicio",
  }),
  employeeId: z.string().optional(),
  notes: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface AddServiceFormProps {
  onSuccess?: () => void;
}

const AddServiceForm: React.FC<AddServiceFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Query client para invalidar queries
  const queryClient = useQueryClient();

  // Cargar vehículos
  const { 
    data: vehicles = [], 
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getAllVehicles
  });

  // Cargar servicios
  const { 
    data: services = [], 
    isLoading: isLoadingServices,
    isError: isErrorServices
  } = useQuery({
    queryKey: ['services'],
    queryFn: getAllServices
  });

  // Cargar empleados activos
  const { 
    data: employees = [], 
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees
  } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
    select: (data) => data.filter((emp: Employee) => emp.status === 'active')
  });

  // Mutación para crear servicio
const createServiceMutation = useMutation({
  mutationFn: (data: Partial<PendingService>) => createPendingService(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['pendingServices'] });
    if (onSuccess) {
      onSuccess();
    }
  }
});

  // Filtrar vehículos basados en búsqueda
  const filteredVehicles = vehicles.filter((vehicle: Vehicle) => 
    vehicle.license_plate.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
    (vehicle.customer_name && vehicle.customer_name.toLowerCase().includes(vehicleSearch.toLowerCase()))
  );

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      vehicleId: '',
      serviceTypeId: '',
      employeeId: '',
      notes: '',
    },
  });

  // Actualizar formulario cuando se selecciona un vehículo
  useEffect(() => {
    if (selectedVehicle) {
      form.setValue('vehicleId', selectedVehicle.vehicle_id.toString());
    }
  }, [selectedVehicle, form]);

  // Actualizar formulario cuando se selecciona un servicio
  useEffect(() => {
    if (selectedService) {
      form.setValue('serviceTypeId', selectedService.service_id.toString());
    }
  }, [selectedService, form]);

  const onSubmit = async (values: ServiceFormValues) => {
    if (!selectedVehicle || !selectedService) {
      toast.error('Debe seleccionar un vehículo y un tipo de servicio');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calcular la hora estimada de finalización
      const entryTime = new Date();
      const estimatedHours = selectedService.estimated_hours || 1; // Por defecto 1 hora
      const estimatedCompletionTime = new Date(entryTime.getTime() + estimatedHours * 60 * 60 * 1000);
      
      // Preparar datos para la API
      const serviceData: Partial<PendingService> = {
        vehicle_id: parseInt(values.vehicleId),
        service_type_id: parseInt(values.serviceTypeId),
        employee_id: values.employeeId ? parseInt(values.employeeId) : undefined,
        entry_time: entryTime.toISOString(),
        estimated_completion_time: estimatedCompletionTime.toISOString(),
        status: values.employeeId ? 'in-progress' : 'pending',
        notes: values.notes
      };
      
      // Enviar a la API
      await createServiceMutation.mutateAsync(serviceData);
      
      toast.success('Servicio registrado correctamente');
      
      // Resetear formulario
      form.reset();
      setSelectedVehicle(null);
      setSelectedService(null);
      
    } catch (error) {
      console.error('Error al registrar servicio:', error);
      toast.error('Error al registrar servicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Selección de vehículo */}
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Vehículo</FormLabel>
              <Popover open={showVehicleSearch} onOpenChange={setShowVehicleSearch}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={`justify-between ${!selectedVehicle ? 'text-muted-foreground' : ''}`}
                    >
                      {selectedVehicle
                        ? `${selectedVehicle.license_plate} - ${selectedVehicle.make} ${selectedVehicle.model}`
                        : "Seleccionar vehículo"}
                      <CarFront className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" alignOffset={-8} side="bottom" sideOffset={8}>
                  <Command>
                    <CommandInput 
                      placeholder="Buscar vehículo..." 
                      value={vehicleSearch}
                      onValueChange={setVehicleSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron vehículos.</CommandEmpty>
                      <CommandGroup heading="Vehículos">
                        {isLoadingVehicles ? (
                          <div className="p-2 text-sm text-muted-foreground">Cargando vehículos...</div>
                        ) : isErrorVehicles ? (
                          <div className="p-2 text-sm text-destructive">Error al cargar vehículos</div>
                        ) : (
                          filteredVehicles.map((vehicle: Vehicle) => (
                            <CommandItem
                              key={vehicle.vehicle_id}
                              value={vehicle.vehicle_id.toString()}
                              onSelect={() => {
                                setSelectedVehicle(vehicle);
                                form.setValue('vehicleId', vehicle.vehicle_id.toString());
                                setShowVehicleSearch(false);
                              }}
                            >
                              <CarFront className="mr-2 h-4 w-4" />
                              <span>{vehicle.license_plate} - {vehicle.make} {vehicle.model}</span>
                              {vehicle.customer_name && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({vehicle.customer_name})
                                </span>
                              )}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedVehicle && (
                <div className="mt-2 rounded-md border border-border p-3 text-sm">
                  <div className="font-medium">{selectedVehicle.customer_name || 'Cliente no disponible'}</div>
                  <div className="mt-1 text-muted-foreground">
                    {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                    {selectedVehicle.color && ` - ${selectedVehicle.color}`}
                  </div>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de servicio */}
        <FormField
          control={form.control}
          name="serviceTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Servicio</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const service = services.find((s: Service) => s.service_id.toString() === value);
                  setSelectedService(service || null);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de servicio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingServices ? (
                    <div className="p-2 text-sm text-muted-foreground">Cargando servicios...</div>
                  ) : isErrorServices ? (
                    <div className="p-2 text-sm text-destructive">Error al cargar servicios</div>
                  ) : (
                    services.map((service: Service) => (
                      <SelectItem key={service.service_id} value={service.service_id.toString()}>
                        {service.name} - ${service.base_price}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedService && (
                <div className="mt-2 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Duración estimada: {selectedService.estimated_hours ? 
                    `${selectedService.estimated_hours * 60} minutos` : 
                    'No especificada'}
                  </span>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Asignación de empleado (opcional) */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asignar a Empleado (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un empleado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingEmployees ? (
                    <div className="p-2 text-sm text-muted-foreground">Cargando empleados...</div>
                  ) : isErrorEmployees ? (
                    <div className="p-2 text-sm text-destructive">Error al cargar empleados</div>
                  ) : (
                    employees.map((employee: Employee) => (
                      <SelectItem key={employee.employee_id} value={employee.employee_id.toString()}>
                        {employee.name} - {employee.position}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notas */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ingrese notas adicionales para este servicio"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botón de envío */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || isLoadingVehicles || isLoadingServices || isLoadingEmployees}
        >
          {isSubmitting ? (
            "Registrando servicio..."
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Registrar Servicio
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddServiceForm;