import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CarFront, User, Calendar, Clock, Check } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createVehicle } from '@/api/vehicleApi';
import { createCustomer, getAllCustomers } from '@/api/customerApi';

// Define la interfaz Customer
interface Customer {
  customer_id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

// Define el esquema del formulario usando Zod
const formSchema = z.object({
  licensePlate: z.string().min(3, {
    message: "La placa debe tener al menos 3 caracteres.",
  }),
  make: z.string().min(2, {
    message: "La marca debe tener al menos 2 caracteres.",
  }),
  model: z.string().min(2, {
    message: "El modelo debe tener al menos 2 caracteres.",
  }),
  year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1900 && Number(val) <= new Date().getFullYear(), {
    message: "Año inválido.",
  }),
  color: z.string().optional(),
  vehicleType: z.string({
    required_error: "Seleccione el tipo de vehículo",
  }),
  clientName: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  clientPhone: z.string().min(7, {
    message: "El teléfono debe tener al menos 7 caracteres.",
  }),
  clientEmail: z.string().email({
    message: "Correo electrónico inválido",
  }).optional().or(z.literal('')),
  serviceType: z.string({
    required_error: "Seleccione el tipo de servicio",
  }),
  employeeId: z.string({
    required_error: "Seleccione el empleado",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Datos para los desplegables
const vehicleTypes = [
  { id: 'sedan', name: 'Sedán' },
  { id: 'suv', name: 'SUV' },
  { id: 'pickup', name: 'Camioneta' },
  { id: 'motorcycle', name: 'Motocicleta' },
];

const serviceTypes = [
  { id: 'basic', name: 'Lavado Básico' },
  { id: 'complete', name: 'Lavado Completo' },
  { id: 'premium', name: 'Lavado Premium' },
  { id: 'engine', name: 'Lavado de Motor' },
];

const employees = [
  { id: 'emp1', name: 'Carlos Rodríguez' },
  { id: 'emp2', name: 'María López' },
  { id: 'emp3', name: 'Juan Pérez' },
];

const VehicleForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Cargar clientes existentes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        // Si hay error al cargar, inicializar con array vacío
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licensePlate: '',
      make: '',
      model: '',
      year: '',
      color: '',
      vehicleType: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceType: '',
      employeeId: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Datos del formulario:', values);
      
      // Primero crear o verificar el cliente
      let customerId;
      
      // Verificar si existe un cliente con el mismo nombre/teléfono
      const existingCustomer = customers.find(
        (c) => c.name === values.clientName && c.phone === values.clientPhone
      );
      
      if (existingCustomer) {
        customerId = existingCustomer.customer_id;
        console.log('Cliente existente:', existingCustomer);
      } else {
        // Crear nuevo cliente
        const newCustomer = await createCustomer({
          name: values.clientName,
          phone: values.clientPhone,
          email: values.clientEmail || null,  // Usar null en lugar de undefined
          address: null  // Usar null explícitamente
        });
        customerId = newCustomer.customer_id;
        console.log('Nuevo cliente creado:', newCustomer);
      }
      
      // Luego crear el vehículo
      const vehicleData = {
        customer_id: customerId,
        make: values.make,
        model: values.model,
        year: Number(values.year),
        license_plate: values.licensePlate,
        color: values.color || undefined
      };
      
      console.log('Datos del vehículo a crear:', vehicleData);
      const createdVehicle = await createVehicle(vehicleData);
      console.log('Vehículo creado:', createdVehicle);
      
      toast.success('Vehículo registrado correctamente');
      form.reset();
    } catch (error: unknown) {
      console.error('Error al registrar:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        // Error de respuesta del servidor
        const errorResponse = error as { response: { data: { error?: string } } };
        console.error('Respuesta del servidor:', errorResponse.response.data);
        toast.error(`Error: ${errorResponse.response.data.error || 'Error al registrar vehículo'}`);
      } else if (error && typeof error === 'object' && 'request' in error) {
        // Error de conexión
        console.error('No hubo respuesta del servidor');
        toast.error('Error de conexión con el servidor');
      } else {
        // Otro tipo de error
        toast.error('Error al registrar vehículo. Verifica los datos e inténtalo nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Registro de Vehículo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información del vehículo */}
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <CarFront className="mr-2 h-4 w-4" />
                      Placa
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese la placa" {...field} className="capitalize" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <CarFront className="mr-2 h-4 w-4" />
                      Tipo de Vehículo
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <CarFront className="mr-2 h-4 w-4" />
                      Marca
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Marca del vehículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <CarFront className="mr-2 h-4 w-4" />
                      Modelo
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo del vehículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Año
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Año del vehículo" {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <CarFront className="mr-2 h-4 w-4" />
                      Color
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Color del vehículo (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Información del cliente */}
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Nombre del Cliente
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Teléfono del Cliente
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Email del Cliente (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Email del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Información del servicio */}
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Tipo de Servicio
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el servicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Empleado que Recibe
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione empleado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="flex justify-end px-0 pb-0">
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? (
                  <>Registrando...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Registrar Vehículo
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;