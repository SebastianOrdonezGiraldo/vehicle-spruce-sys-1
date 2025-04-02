// src/pages/Employees.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Search, 
  UserPlus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  getAllEmployees, 
  deleteEmployee, 
  createEmployee 
} from '@/api/employeeApi';
import EmployeeForm from '@/components/EmployeeForm';

// Interfaz para el empleado
interface Employee {
  employee_id?: number;
  name: string;
  position: string;
  email?: string | null;
  phone?: string | null;
  hire_date: string;
  status: 'active' | 'inactive';
}

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Query client para invalidar queries
  const queryClient = useQueryClient();

  // Cargar empleados usando React Query
  const { 
    data: employees = [], 
    isLoading, 
    isError,
    refetch 
  } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees
  });

  // Mutación para eliminar empleados
  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast.success('Empleado eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (error) => {
      console.error('Error al eliminar empleado:', error);
      toast.error('Error al eliminar empleado');
    }
  });

  // Mutación para crear empleados
  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success('Empleado creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setAddDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error al crear empleado:', error);
      toast.error('Error al crear empleado');
    }
  });

  // Filtrar empleados según término de búsqueda
  const filteredEmployees = employees.filter((employee: Employee) => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.email && employee.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Manejador para editar empleado
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  // Manejador para confirmar eliminación
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  // Manejador para eliminar empleado
  const handleDeleteEmployee = async () => {
    if (!employeeToDelete?.employee_id) return;
    await deleteEmployeeMutation.mutateAsync(employeeToDelete.employee_id);
  };

  // Manejador para crear empleado
  const handleCreateEmployee = async (employeeData: Employee) => {
    await createEmployeeMutation.mutateAsync(employeeData);
  };

  // Manejador para actualización exitosa
  const handleEmployeeUpdated = () => {
    setEditDialogOpen(false);
    refetch(); // Recargar la lista después de actualizar
    setSelectedEmployee(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona el personal de tu centro de lavado
        </p>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-auto grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar empleados..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Registra un nuevo empleado en el sistema
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm 
              employee={{
                name: '',
                position: '',
                hire_date: new Date().toISOString().split('T')[0],
                status: 'active'
              }}
              onSuccess={handleCreateEmployee}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de empleados */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>
            Empleados activos e inactivos del centro de lavado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Esqueleto de carga
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            // Manejo de error
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-2" />
              <h3 className="text-lg font-medium">Error al cargar empleados</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                No pudimos cargar la lista de empleados. Por favor intenta de nuevo.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            // Sin resultados
            <div className="text-center py-10">
              <User className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No se encontraron empleados</h3>
              <p className="mt-1 text-muted-foreground">
                {searchTerm ? "Prueba con diferentes términos de búsqueda" : "Agrega un nuevo empleado para comenzar"}
              </p>
            </div>
          ) : (
            // Tabla de empleados
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Fecha de Contratación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee: Employee) => (
                  <TableRow key={employee.employee_id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <div>
                        {employee.email && <div className="text-sm">{employee.email}</div>}
                        {employee.phone && <div className="text-sm text-muted-foreground">{employee.phone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={employee.status === 'active' ? "success" : "outline"}
                        className={employee.status === 'active' ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(employee)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición de empleado */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Actualiza la información del empleado
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm
              employee={selectedEmployee}
              onSuccess={handleEmployeeUpdated}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              al empleado {employeeToDelete?.name} y toda su información.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-destructive text-destructive-foreground"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Employees;