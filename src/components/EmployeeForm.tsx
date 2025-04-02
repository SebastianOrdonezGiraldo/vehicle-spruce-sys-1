// src/components/EmployeeForm.tsx
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Calendar, Mail, Phone, Check } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

// Interface para el empleado
interface Employee {
  employee_id?: number;
  name: string;
  position: string;
  email?: string | null;
  phone?: string | null;
  hire_date: string;
  status: 'active' | 'inactive';
}

// Definir esquema del formulario
const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  position: z.string().min(2, {
    message: "El cargo debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Correo electrónico inválido",
  }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  hire_date: z.string().refine(date => {
    const selectedDate = new Date(date);
    return !isNaN(selectedDate.getTime()) && selectedDate <= new Date();
  }, {
    message: "Fecha inválida. No puede ser una fecha futura.",
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: "Seleccione el estado del empleado",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Datos para los desplegables
const positions = [
  { id: 'tecnico', name: 'Técnico de Lavado' },
  { id: 'supervisor', name: 'Supervisor' },
  { id: 'recepcionista', name: 'Recepcionista' },
  { id: 'admin', name: 'Administrador' },
];

const statuses = [
  { id: 'active', name: 'Activo' },
  { id: 'inactive', name: 'Inactivo' },
];

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess: (employeeData: Employee) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: employee ? {
      name: employee.name,
      position: employee.position,
      email: employee.email || '',
      phone: employee.phone || '',
      hire_date: new Date(employee.hire_date).toISOString().split('T')[0],
      status: employee.status,
    } : {
      name: '',
      position: '',
      email: '',
      phone: '',
      hire_date: new Date().toISOString().split('T')[0],
      status: 'active',
    },
  });

  // Actualizar el formulario cuando cambia el empleado
  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        position: employee.position,
        email: employee.email || '',
        phone: employee.phone || '',
        hire_date: new Date(employee.hire_date).toISOString().split('T')[0],
        status: employee.status,
      });
    }
  }, [employee, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Preparar los datos para enviar
      const employeeData: Employee = {
        name: values.name,
        position: values.position,
        email: values.email || null,
        phone: values.phone || null,
        hire_date: values.hire_date,
        status: values.status
      };
      
      // Si es un empleado existente, incluir el ID
      if (employee && employee.employee_id) {
        employeeData.employee_id = employee.employee_id;
      }
      
      // Llamar a la función onSuccess
      await onSuccess(employeeData);
    } catch (error: unknown) {
      console.error('Error al guardar empleado:', error);
      toast.error('Error al guardar empleado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full animate-fade-in border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Cargo
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.name}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      Teléfono (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hire_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Fecha de Contratación
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Estado
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
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
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {employee ? 'Actualizar Empleado' : 'Crear Empleado'}
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

export default EmployeeForm;