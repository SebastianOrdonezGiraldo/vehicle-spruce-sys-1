// src/components/AdjustQuantityForm.tsx
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Minus, Save } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

// Schema for form validation
const adjustQuantitySchema = z.object({
  adjustmentType: z.enum(['add', 'remove']),
  quantity: z.coerce.number().positive({ message: 'La cantidad debe ser un número positivo' }),
  reason: z.string().optional(),
});

type AdjustQuantityFormValues = z.infer<typeof adjustQuantitySchema>;

interface AdjustQuantityFormProps {
  itemName: string;
  currentStock: number;
  unit: string;
  onSubmit: (adjustmentType: 'add' | 'remove', quantity: number, reason?: string) => Promise<void>;
  isSubmitting: boolean;
}

const AdjustQuantityForm: React.FC<AdjustQuantityFormProps> = ({ 
  itemName, 
  currentStock, 
  unit, 
  onSubmit, 
  isSubmitting 
}) => {
  // Form with validation
  const form = useForm<AdjustQuantityFormValues>({
    resolver: zodResolver(adjustQuantitySchema),
    defaultValues: {
      adjustmentType: 'add',
      quantity: 1,
      reason: '',
    },
  });

  // Handle form submission
  const handleSubmit = async (values: AdjustQuantityFormValues) => {
    await onSubmit(
      values.adjustmentType, 
      values.quantity, 
      values.reason
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Product info */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">{itemName}</h3>
          <p className="text-sm text-muted-foreground">
            Stock actual: {currentStock} {unit}
          </p>
        </div>

        {/* Adjustment type (add or remove) */}
        <FormField
          control={form.control}
          name="adjustmentType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de ajuste</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="add" />
                    <FormLabel htmlFor="add" className="font-normal cursor-pointer flex items-center">
                      <Plus className="mr-1 h-4 w-4 text-green-600" />
                      Agregar
                    </FormLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remove" id="remove" />
                    <FormLabel htmlFor="remove" className="font-normal cursor-pointer flex items-center">
                      <Minus className="mr-1 h-4 w-4 text-red-600" />
                      Retirar
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity */}
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
                  min="0.01" 
                  placeholder="0" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Motivo del ajuste de inventario" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Warning for removing stock */}
        {form.watch('adjustmentType') === 'remove' && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            <strong>Nota:</strong> Al retirar productos del inventario, se registrará como un uso interno.
            {currentStock < form.watch('quantity') && (
              <p className="text-red-600 mt-1">
                <strong>¡Advertencia!</strong> La cantidad a retirar es mayor que el stock disponible.
              </p>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || (form.watch('adjustmentType') === 'remove' && currentStock < form.watch('quantity'))}
        >
          {isSubmitting ? 'Guardando...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Confirmar ajuste
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AdjustQuantityForm;