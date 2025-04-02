
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock data for the reports
const dailyIncomeData = [
  { day: 'Lun', income: 2100 },
  { day: 'Mar', income: 1800 },
  { day: 'Mié', income: 2400 },
  { day: 'Jue', income: 2800 },
  { day: 'Vie', income: 3200 },
  { day: 'Sáb', income: 3800 },
  { day: 'Dom', income: 1500 },
];

const serviceTypeData = [
  { name: 'Básico', value: 35 },
  { name: 'Completo', value: 45 },
  { name: 'Premium', value: 15 },
  { name: 'Motor', value: 5 },
];

const serviceTimeData = [
  { type: 'Básico', time: 25 },
  { type: 'Completo', time: 45 },
  { type: 'Premium', time: 65 },
  { type: 'Motor', time: 35 },
];

const vehicleHistoryData = [
  { date: '01/05', services: 2 },
  { date: '03/05', services: 1 },
  { date: '08/05', services: 3 },
  { date: '15/05', services: 1 },
  { date: '22/05', services: 2 },
  { date: '28/05', services: 1 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [vehiclePlate, setVehiclePlate] = useState('ABC123');

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
                  <div className="mt-1 text-lg font-bold">$16,600</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Promedio Diario</div>
                  <div className="mt-1 text-lg font-bold">$2,371</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Mejor Día</div>
                  <div className="mt-1 text-lg font-bold">Sábado</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs font-medium text-muted-foreground">Total Servicios</div>
                  <div className="mt-1 text-lg font-bold">158</div>
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
                  <div className="mt-1 text-lg font-bold">42.5 min</div>
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
