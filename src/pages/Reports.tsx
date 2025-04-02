import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

// Interfaz para los datos de los reportes
interface ReportData {
  dailyIncomeData: Array<{ day: string; income: number }>;
  serviceTypeData: Array<{ name: string; value: number }>;
  serviceTimeData: Array<{ type: string; time: number }>;
  vehicleHistoryData: Array<{ date: string; services: number }>;
  summaryStats: {
    totalIncome: number;
    dailyAverage: number;
    bestDay: string;
    totalServices: number;
    avgServiceTime: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [vehiclePlate, setVehiclePlate] = useState('ABC123');

  // Función para obtener los reportes desde la API
  const fetchReports = async (): Promise<ReportData> => {
    const response = await fetch('/api/reports');
    if (!response.ok) {
      throw new Error('Error al obtener reportes');
    }
    return response.json();
  };

  // Usar React Query para manejar la obtención de datos
  const { 
    data: reports, 
    isLoading, 
    isError 
  } = useQuery<ReportData>({
    queryKey: ['reports'],
    queryFn: fetchReports,
    // Opcional: revalidar cada minuto
    refetchInterval: 60000
  });

  // Función para renderizar un esqueleto de carga
  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );

  // Si está cargando, muestra un esqueleto
  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground mt-1">
            Visualice estadísticas y datos importantes del negocio.
          </p>
        </div>
        {renderLoadingSkeleton()}
      </div>
    );
  }

  // Si hay un error, muestra un mensaje de error
  if (isError || !reports) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground mt-1">
            Error al cargar los reportes
          </p>
        </div>
      </div>
    );
  }

  // Destructurar los datos de los reportes
  const { 
    dailyIncomeData, 
    serviceTypeData, 
    serviceTimeData, 
    vehicleHistoryData, 
    summaryStats 
  } = reports;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground mt-1">
          Visualice estadísticas y datos importantes del negocio.
        </p>
      </div>
      
      <Tabs defaultValue="income" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="income">Ingresos</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="times">Tiempos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        
        {/* Income Report */}
        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Ingresos Diarios</CardTitle>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="flex items-center space-x-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      <span>{date ? format(date, 'MMMM yyyy') : 'Seleccionar mes'}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Ingresos']}
                      labelFormatter={(label) => `Día: ${label}`}
                    />
                    <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Ingreso Total</div>
                  <div className="mt-1 text-lg font-bold">${summaryStats.totalIncome.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Promedio Diario</div>
                  <div className="mt-1 text-lg font-bold">${summaryStats.dailyAverage.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Mejor Día</div>
                  <div className="mt-1 text-lg font-bold">{summaryStats.bestDay}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Total Servicios</div>
                  <div className="mt-1 text-lg font-bold">{summaryStats.totalServices}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Services Report */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Distribución de Servicios</CardTitle>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <div className="space-y-2">
                  {serviceTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Service Times Report */}
        <TabsContent value="times" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Tiempo Promedio por Servicio</CardTitle>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={serviceTimeData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" />
                    <Tooltip 
                      formatter={(value) => [`${value} min`, 'Tiempo Promedio']}
                    />
                    <Bar dataKey="time" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Tiempo Promedio</div>
                  <div className="mt-1 text-lg font-bold">{summaryStats.avgServiceTime.toFixed(1)} min</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Más Rápido</div>
                  <div className="mt-1 text-lg font-bold">Básico</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Más Lento</div>
                  <div className="mt-1 text-lg font-bold">Premium</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Eficiencia</div>
                  <div className="mt-1 text-lg font-bold">89%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vehicle History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Historial de Vehículo</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">{vehiclePlate}</h3>
                  <p className="text-sm text-muted-foreground">Sedán - Toyota Corolla</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">Juan Pérez</p>
                </div>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vehicleHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      formatter={(value) => [`${value}`, 'Servicios']}
                      labelFormatter={(label) => `Fecha: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="services" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Último Servicio</h4>
                <div className="rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha</p>
                      <p className="font-medium">28/05/2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo</p>
                      <p className="font-medium">Lavado Premium</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Empleado</p>
                      <p className="font-medium">Carlos Rodríguez</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Costo</p>
                      <p className="font-medium">$45.00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline">Ver todos los servicios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;