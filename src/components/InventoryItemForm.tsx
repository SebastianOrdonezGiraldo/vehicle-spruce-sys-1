// src/components/InventoryItemForm.tsx
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Package2, Tag, DollarSign, Hash, Save } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { InventoryItem } from '@/api/inventoryApi';

// Schema for form validation
const inventoryItemSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  description: z.string().optional(),
  category: z.string().min(2, { message: 'La categoría es requerida' }),
  quantity: z.coerce.number().min(0, { message: 'La cantidad debe ser un número positivo' }),
  unit: z.string().min(1, { message: 'La unidad es requerida' }),
  cost_price: z.coerce.number().min(0, { message: 'El precio de costo debe ser un número positivo' }),
  selling_price: z.coerce.number().min(0, { message: 'El precio de venta debe ser un número positivo' }),
  reorder_level: z.coerce.number().int().min(1, { message: 'El nivel de reorden debe ser un número entero positivo' }),
});

type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

interface InventoryItemFormProps {
  initialData?: InventoryItem;
  onSubmit: (data: InventoryItemFormValues) => Promise<void>;
  categories: string[];
  isSubmitting: boolean;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({ 
  initialData, 
  onSubmit, 
  categories, 
  isSubmitting 
}) => {
  // Form with validation
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      quantity: initialData?.quantity || 0,
      unit: initialData?.unit || 'unidad',
      cost_price: initialData?.cost_price || 0,
      selling_price: initialData?.selling_price || 0,
      reorder_level: initialData?.reorder_level || 5,
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || '',
        category: initialData.category,
        quantity: initialData.quantity,
        unit: initialData.unit,
        cost_price: initialData.cost_price,
        selling_price: initialData.selling_price,
        reorder_level: initialData.reorder_level,
      });
    }
  }, [initialData, form]);

  // Common units for inventory items
  const units = [
    'unidad', 'litro', 'galón', 'botella', 'caja', 'paquete', 'rollo', 'metro', 'pieza'
  ];

  // Handle form submission
  const handleSubmit = async (values: InventoryItemFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error al guardar el producto');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Package2 className="mr-2 h-4 w-4" />
                  Nombre del producto
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del producto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Tag className="mr-2 h-4 w-4" />
                  Categoría
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Nueva">+ Agregar nueva categoría</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descripción del producto" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cost and Selling Price */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="cost_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <DollarSign className="mr-1 h-4 w-4" />
                    Precio de costo
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selling_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <DollarSign className="mr-1 h-4 w-4" />
                    Precio de venta
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Reorder Level */}
          <FormField
            control={form.control}
            name="reorder_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Hash className="mr-2 h-4 w-4" />
                  Nivel de reorden
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="5" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Guardando...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {initialData ? 'Actualizar producto' : 'Guardar producto'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default InventoryItemForm;