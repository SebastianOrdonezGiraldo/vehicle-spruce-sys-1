
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Users, 
  Car, 
  Droplets, 
  Clock, 
  DollarSign, 
  Tag, 
  Save,
  Brush,
  Palette
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings = () => {
  const [companyName, setCompanyName] = useState('AutoLavado Express');
  const [address, setAddress] = useState('Av. Principal #123');
  const [phone, setPhone] = useState('555-123-4567');
  const [email, setEmail] = useState('contacto@autolavado.com');
  const [taxRate, setTaxRate] = useState('16');
  const [currency, setCurrency] = useState('MXN');
  const [receiptFooter, setReceiptFooter] = useState('¡Gracias por su preferencia!');
  
  // Service thresholds
  const [standardWashTime, setStandardWashTime] = useState('30');
  const [premiumWashTime, setPremiumWashTime] = useState('45');
  const [detailingTime, setDetailingTime] = useState('90');
  
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [delayAlerts, setDelayAlerts] = useState(true);
  const [stockThreshold, setStockThreshold] = useState('10');
  
  // Theme
  const [darkMode, setDarkMode] = useState(false);
  
  // Save settings
  const handleSaveSettings = () => {
    toast.success('Configuración guardada correctamente');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            Configuración
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra la configuración general del sistema
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
              <CardDescription>
                Configura la información básica de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nombre de la Empresa</Label>
                  <Input 
                    id="company-name" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input 
                    id="address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuración Fiscal</CardTitle>
              <CardDescription>
                Configura parámetros relacionados con aspectos fiscales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tasa de Impuesto (%)</Label>
                  <Input 
                    id="tax-rate" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Input 
                    id="currency" 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="receipt-footer">Texto en pie de recibos</Label>
                  <Input 
                    id="receipt-footer" 
                    value={receiptFooter} 
                    onChange={(e) => setReceiptFooter(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Services Settings */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tiempos de Servicio</CardTitle>
              <CardDescription>
                Establece los tiempos estimados para cada tipo de servicio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standard-time">
                    Lavado Estándar (minutos)
                    <Badge variant="outline" className="ml-2">Predeterminado</Badge>
                  </Label>
                  <Input 
                    id="standard-time" 
                    value={standardWashTime} 
                    onChange={(e) => setStandardWashTime(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premium-time">Lavado Premium (minutos)</Label>
                  <Input 
                    id="premium-time" 
                    value={premiumWashTime} 
                    onChange={(e) => setPremiumWashTime(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detailing-time">Detallado (minutos)</Label>
                  <Input 
                    id="detailing-time" 
                    value={detailingTime} 
                    onChange={(e) => setDetailingTime(e.target.value)}
                    type="number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Prioridad de Servicio</CardTitle>
              <CardDescription>
                Administra la prioridad de atención a los distintos tipos de vehículos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span>Sedán/Hatchback</span>
                  </div>
                  <Badge>Alta</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span>SUV/Crossover</span>
                  </div>
                  <Badge>Media</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span>Camioneta/Pickup</span>
                  </div>
                  <Badge>Normal</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span>Vehículo Comercial</span>
                  </div>
                  <Badge>Baja</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas y Notificaciones</CardTitle>
              <CardDescription>
                Configura cuándo y cómo recibir alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificaciones por Correo</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones importantes por correo electrónico
                  </p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stock-alerts">Alertas de Inventario Bajo</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifica cuando productos estén por debajo del umbral
                  </p>
                </div>
                <Switch 
                  id="stock-alerts"
                  checked={stockAlerts}
                  onCheckedChange={setStockAlerts}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="delay-alerts">Alertas de Servicios Retrasados</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifica cuando servicios excedan su tiempo estimado
                  </p>
                </div>
                <Switch 
                  id="delay-alerts"
                  checked={delayAlerts}
                  onCheckedChange={setDelayAlerts}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="stock-threshold">Umbral para Alertas de Inventario</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Cantidad mínima de unidades antes de generar alertas
                </p>
                <Input 
                  id="stock-threshold" 
                  value={stockThreshold} 
                  onChange={(e) => setStockThreshold(e.target.value)}
                  type="number"
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema y Apariencia</CardTitle>
              <CardDescription>
                Personaliza la apariencia de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <Label htmlFor="dark-mode">Modo Oscuro</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cambia entre tema claro y oscuro
                  </p>
                </div>
                <Switch 
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Card className="border-2 border-primary p-4 flex flex-col items-center">
                  <div className="rounded-md p-2 bg-primary mb-2">
                    <Brush className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">Tema Predeterminado</span>
                </Card>
                <Card className="border p-4 flex flex-col items-center hover:border-primary">
                  <div className="rounded-md p-2 bg-blue-500 mb-2">
                    <Brush className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Tema Oceánico</span>
                </Card>
                <Card className="border p-4 flex flex-col items-center hover:border-primary">
                  <div className="rounded-md p-2 bg-green-500 mb-2">
                    <Brush className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Tema Forestal</span>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
