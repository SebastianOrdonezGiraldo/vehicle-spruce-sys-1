// src/components/InventoryUsageHistory.tsx
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Package2, 
  User, 
  Calendar, 
  FileText, 
  Car,
  ArrowDownCircle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { InventoryUsage } from '@/api/inventoryApi';

interface InventoryUsageHistoryProps {
  usageHistory: InventoryUsage[];
  isLoading: boolean;
  className?: string;
}

const InventoryUsageHistory: React.FC<InventoryUsageHistoryProps> = ({ 
  usageHistory, 
  isLoading, 
  className 
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (usageHistory.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-10 text-center ${className}`}>
        <ArrowDownCircle className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No hay historial de uso</h3>
        <p className="text-muted-foreground mt-1">
          Aún no se ha registrado ningún uso para este producto.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usageHistory.map((usage) => (
              <TableRow key={usage.usage_id}>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {typeof usage.usage_date === 'string' 
                      ? format(new Date(usage.usage_date), 'dd/MM/yyyy HH:mm', { locale: es })
                      : format(usage.usage_date, 'dd/MM/yyyy HH:mm', { locale: es })
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={Number(usage.quantity) > 0 ? "outline" : "destructive"}>
                    {usage.quantity} {/* Quitamos la referencia a unit */}
                  </Badge>
                </TableCell>
                <TableCell>
                  {usage.employee_name ? (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {usage.employee_name}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No asignado</span>
                  )}
                </TableCell>
                <TableCell>
                  {usage.service_name ? (
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                      {usage.service_name}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Uso interno</span>
                  )}
                </TableCell>
                <TableCell>
                  {usage.notes ? (
                    <div className="flex items-center max-w-xs truncate">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{usage.notes}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryUsageHistory;