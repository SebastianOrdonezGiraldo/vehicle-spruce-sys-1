// src/components/InventoryItemCard.tsx
import React from 'react';
import { 
  Package2, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Plus, 
  Minus, 
  History, 
  ShoppingCart 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { InventoryItem } from '@/api/inventoryApi';

interface InventoryItemCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAdjustQuantity: (item: InventoryItem) => void;
  onViewHistory: (item: InventoryItem) => void;
}

const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined) return 'N/A';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return isNaN(numPrice) ? 'N/A' : numPrice.toFixed(2);
};

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ 
  item, 
  onEdit, 
  onDelete, 
  onAdjustQuantity,
  onViewHistory
}) => {
  // Calculate stock percentage for progress bar
  const stockPercentage = Math.min(Math.round((item.quantity / item.reorder_level) * 100), 100);
  
  // Determine stock status
  const isLowStock = item.quantity <= item.reorder_level;
  const isOutOfStock = item.quantity === 0;
  
  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`rounded-lg p-2 ${isLowStock ? 'bg-red-100' : 'bg-primary/10'}`}>
              <Package2 className={`h-5 w-5 ${isLowStock ? 'text-red-600' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onAdjustQuantity(item)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajustar cantidad
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onViewHistory(item)}>
                <History className="mr-2 h-4 w-4" />
                Ver historial
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onDelete(item)} 
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Item description (if available) */}
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        
        {/* Stock information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Inventario</span>
            <span className="text-sm text-muted-foreground">
              {item.quantity} {item.unit}
            </span>
          </div>
          
          <Progress value={stockPercentage} 
            className={`h-2 ${
              isOutOfStock ? 'bg-red-100' : 
              isLowStock ? 'bg-amber-100' : 
              'bg-muted'
            }`} 
          />
          
          <div className="flex justify-between items-center">
            <div>
              {isOutOfStock ? (
                <Badge variant="destructive">Sin Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  Stock Bajo
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                  Disponible
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Mínimo: {item.reorder_level} {item.unit}
            </div>
          </div>
        </div>
        
        {/* Price information */}
        <div className="mt-4 flex justify-between items-center border-t pt-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Precio costo</p>
            <p className="font-medium">${formatPrice(item.cost_price)}</p>
          </div>
          
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground">Precio venta</p>
            <p className="font-medium">${formatPrice(item.selling_price)}</p>
          </div>
        </div>
        
        {/* Quick action buttons */}
        <div className="mt-4 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onAdjustQuantity(item)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onAdjustQuantity(item)}
            disabled={isOutOfStock}
          >
            <Minus className="h-4 w-4 mr-1" />
            Retirar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryItemCard;