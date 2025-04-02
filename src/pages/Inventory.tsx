// src/pages/Inventory.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Package2, 
  Plus, 
  Search, 
  AlertTriangle,
  Filter,
  ArrowDownUp,
  History,
  Download
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Component imports
import InventoryItemForm from '@/components/InventoryItemForm';
import AdjustQuantityForm from '@/components/AdjustQuantityForm';
import InventoryItemCard from '@/components/InventoryItemCard';
import InventoryUsageHistory from '@/components/InventoryUsageHistory';

// API imports
import { 
  InventoryItem, 
  getAllInventoryItems, 
  getLowStockItems,
  getItemsByCategory,
  searchInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  adjustInventoryQuantity,
  recordInventoryUsage,
  getAllCategories,
  getInventoryUsageHistory,
  getAllInventoryUsage,
  InventoryUsage
} from '@/api/inventoryApi';

const Inventory = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof InventoryItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialogs state
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false);
  const [adjustQuantityDialogOpen, setAdjustQuantityDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Selected item for various operations
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Queries
  const { 
    data: inventoryItems = [], 
    isLoading: isLoadingItems,
    isError: isErrorItems
  } = useQuery({
    queryKey: ['inventory'],
    queryFn: getAllInventoryItems
  });

  const { 
    data: categories = [], 
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['inventoryCategories'],
    queryFn: getAllCategories,
    select: (data) => {
      // Extract just the category names from the response
      return data.map((item: { category: string }) => item.category);
    }
  });

  const { 
    data: lowStockItems = [], 
    isLoading: isLoadingLowStock
  } = useQuery({
    queryKey: ['lowStockItems'],
    queryFn: getLowStockItems,
    enabled: activeTab === 'low-stock'
  });

  // Query for searching items
  const { 
    data: searchResults = [],
    isLoading: isSearching
  } = useQuery({
    queryKey: ['inventorySearch', searchTerm],
    queryFn: () => searchInventoryItems(searchTerm),
    enabled: searchTerm.length > 2, // Only search if term is at least 3 chars
    placeholderData: previousData => previousData
  });

  // Query for category filter
  const { 
    data: categoryResults = [],
    isLoading: isLoadingCategory
  } = useQuery({
    queryKey: ['inventoryCategory', categoryFilter],
    queryFn: () => getItemsByCategory(categoryFilter),
    enabled: categoryFilter !== 'all',
    placeholderData: previousData => previousData
  });

  // Query for item usage history
  const { 
    data: itemUsageHistory = [], 
    isLoading: isLoadingHistory
  } = useQuery({
    queryKey: ['itemUsageHistory', selectedItem?.item_id],
    queryFn: () => selectedItem ? getInventoryUsageHistory(selectedItem.item_id!) : Promise.resolve([]),
    enabled: !!selectedItem?.item_id && historyDialogOpen
  });

  // Query for all usage history
  const { 
    data: allUsageHistory = [], 
    isLoading: isLoadingAllHistory
  } = useQuery({
    queryKey: ['allUsageHistory'],
    queryFn: () => getAllInventoryUsage(100),
    enabled: activeTab === 'usage'
  });

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setAddItemDialogOpen(false);
      toast.success('Producto agregado correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error creating item:', error);
      toast.error('Error al agregar el producto');
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: (data: { id: number, item: Partial<InventoryItem> }) => 
      updateInventoryItem(data.id, data.item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setEditItemDialogOpen(false);
      setSelectedItem(null);
      toast.success('Producto actualizado correctamente');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error updating item:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      console.error('Error updating item:', error);
      toast.error('Error al actualizar el producto');
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      toast.success('Producto eliminado correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error deleting item:', error);
      toast.error('Error al eliminar el producto');
    }
  });

  const adjustQuantityMutation = useMutation({
    mutationFn: (data: { id: number, adjustment: number }) => 
      adjustInventoryQuantity(data.id, data.adjustment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockItems'] });
      setAdjustQuantityDialogOpen(false);
      toast.success('Cantidad ajustada correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error adjusting quantity:', error);
      toast.error('Error al ajustar la cantidad');
    }
  });

  const recordUsageMutation = useMutation({
    mutationFn: recordInventoryUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockItems'] });
      queryClient.invalidateQueries({ queryKey: ['itemUsageHistory'] });
      queryClient.invalidateQueries({ queryKey: ['allUsageHistory'] });
      setAdjustQuantityDialogOpen(false);
      toast.success('Uso registrado correctamente');
    },
    onError: (error: unknown) => {
      console.error('Error recording usage:', error);
      toast.error('Error al registrar el uso');
    }
  });

  // Determine which items to display based on active tab and filters
  const getDisplayedItems = () => {
    if (activeTab === 'low-stock') {
      return lowStockItems;
    }
    
    if (searchTerm.length > 2) {
      return searchResults;
    }
    
    if (categoryFilter !== 'all') {
      return categoryResults;
    }
    
    return inventoryItems;
  };

  // Sort the displayed items
  const sortedItems = [...getDisplayedItems()].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Handler for adding a new item
  const handleAddItem = async (data: InventoryItem) => {
    await createItemMutation.mutateAsync(data);
  };

  // Handler for updating an item
  const handleUpdateItem = async (data: InventoryItem) => {
    if (!selectedItem?.item_id) return;
    
    await updateItemMutation.mutateAsync({ 
      id: selectedItem.item_id, 
      item: data 
    });
  };

  // Handler for deleting an item
  const handleDeleteItem = async () => {
    if (!selectedItem?.item_id) return;
    
    await deleteItemMutation.mutateAsync(selectedItem.item_id);
  };

  // Handler for adjusting quantity
  const handleAdjustQuantity = async (
    adjustmentType: 'add' | 'remove', 
    quantity: number, 
    reason?: string
  ) => {
    if (!selectedItem?.item_id) return;
    
    const adjustment = adjustmentType === 'add' ? quantity : -quantity;
    
    if (adjustmentType === 'remove') {
      // Record usage when removing items
      await recordUsageMutation.mutateAsync({
        item_id: selectedItem.item_id,
        quantity,
        usage_date: new Date(),
        notes: reason || 'Uso interno'
      });
    } else {
      // Just adjust quantity when adding items
      await adjustQuantityMutation.mutateAsync({
        id: selectedItem.item_id,
        adjustment
      });
    }
  };

  // Handler for sorting
  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Count low stock items
  const lowStockCount = inventoryItems.filter(item => item.quantity <= item.reorder_level).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona los insumos y materiales utilizados en el servicio de lavado.
        </p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="inventory" className="relative">
              Inventario
              {lowStockCount > 0 && (
                <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {lowStockCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="low-stock">Stock Bajo</TabsTrigger>
            <TabsTrigger value="usage">Historial de Uso</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar producto..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Añadir Nuevo Producto</DialogTitle>
                  <DialogDescription>
                    Completa la información para agregar un nuevo producto al inventario.
                  </DialogDescription>
                </DialogHeader>
                <InventoryItemForm 
                  onSubmit={handleAddItem}
                  categories={categories}
                  isSubmitting={createItemMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {lowStockCount > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <p className="text-red-600 font-medium">
                    {lowStockCount} producto(s) con stock bajo necesitan reposición.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4">
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSort('name')}
                className="text-xs"
              >
                Nombre
                {sortField === 'name' && (
                  <ArrowDownUp className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSort('quantity')}
                className="text-xs"
              >
                Cantidad
                {sortField === 'quantity' && (
                  <ArrowDownUp className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSort('category')}
                className="text-xs"
              >
                Categoría
                {sortField === 'category' && (
                  <ArrowDownUp className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Items Grid */}
          {isLoadingItems || isSearching || isLoadingCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-[300px]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div>
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-20 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full my-4" />
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-12">
              <Package2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No se encontraron productos</h3>
              <p className="mt-1 text-muted-foreground">
                {searchTerm ? "Prueba con otros términos de búsqueda" : "Agrega productos para comenzar"}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setAddItemDialogOpen(true)} 
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Producto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedItems.map(item => (
                <InventoryItemCard 
                  key={item.item_id}
                  item={item}
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setEditItemDialogOpen(true);
                  }}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setDeleteDialogOpen(true);
                  }}
                  onAdjustQuantity={(item) => {
                    setSelectedItem(item);
                    setAdjustQuantityDialogOpen(true);
                  }}
                  onViewHistory={(item) => {
                    setSelectedItem(item);
                    setHistoryDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock" className="space-y-4">
          {isLoadingLowStock ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-[300px]">
                  <CardContent className="p-6">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-green-700">Todo el inventario está en niveles adecuados</h3>
              <p className="mt-1 text-green-600">
                No hay productos con niveles bajos de stock
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map(item => (
                <InventoryItemCard 
                  key={item.item_id}
                  item={item}
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setEditItemDialogOpen(true);
                  }}
                  onDelete={(item) => {
                    setSelectedItem(item);
                    setDeleteDialogOpen(true);
                  }}
                  onAdjustQuantity={(item) => {
                    setSelectedItem(item);
                    setAdjustQuantityDialogOpen(true);
                  }}
                  onViewHistory={(item) => {
                    setSelectedItem(item);
                    setHistoryDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Usage History Tab */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Historial de Uso de Inventario</h3>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
              
              <InventoryUsageHistory 
                usageHistory={allUsageHistory as InventoryUsage[]} 
                isLoading={isLoadingAllHistory} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Item Dialog */}
      <Dialog open={editItemDialogOpen} onOpenChange={setEditItemDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Actualiza la información del producto seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <InventoryItemForm 
              initialData={selectedItem}
              onSubmit={handleUpdateItem}
              categories={categories}
              isSubmitting={updateItemMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Adjust Quantity Dialog */}
      <Dialog open={adjustQuantityDialogOpen} onOpenChange={setAdjustQuantityDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ajustar Cantidad</DialogTitle>
            <DialogDescription>
              Añade o retira unidades del inventario.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <AdjustQuantityForm 
              itemName={selectedItem.name}
              currentStock={selectedItem.quantity}
              unit={selectedItem.unit}
              onSubmit={handleAdjustQuantity}
              isSubmitting={adjustQuantityMutation.isPending || recordUsageMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Usage History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Historial de Uso</DialogTitle>
            <DialogDescription>
              {selectedItem && `Historial de uso para ${selectedItem.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[500px] overflow-auto">
            <InventoryUsageHistory 
              usageHistory={itemUsageHistory as InventoryUsage[]} 
              isLoading={isLoadingHistory} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el producto 
              <span className="font-medium"> {selectedItem?.name}</span>.
              Si este producto ya ha sido utilizado, considera desactivarlo en lugar de eliminarlo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inventory;