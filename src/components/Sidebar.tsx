
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  CarFront, 
  Clock, 
  Users, 
  BarChart3, 
  Settings, 
  Layers, 
  Package
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: CarFront, label: 'Registro de Vehículos', path: '/vehicle-registration' },
    { icon: Clock, label: 'Servicios Pendientes', path: '/pending-services' },
    { icon: Users, label: 'Empleados', path: '/employees' },
    { icon: Package, label: 'Inventario', path: '/inventory' },
    { icon: BarChart3, label: 'Reportes', path: '/reports' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-30 glass border-r transition-all duration-300 transform h-full",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        "md:w-64 w-72"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16" /> {/* Space for header */}
        
        <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="p-4 mt-auto">
          <div className="px-3 py-3 rounded-lg bg-accent/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-semibold text-xs">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium">Juan Pérez</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
