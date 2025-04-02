
import { query } from './dbService';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { updateWorkOrderTotalCost } from './workOrderCostService';

export type OrderPart = {
  order_part_id?: number;
  order_id: number;
  item_id: number;
  quantity: number;
  price_per_unit: number;
};

export async function addPartToOrder(orderPart: OrderPart) {
  // Check if there's enough inventory
  const inventoryItems = await query('SELECT quantity FROM inventory WHERE item_id = ?', [orderPart.item_id]) as RowDataPacket[];
  if (inventoryItems.length === 0) {
    return { error: 'Item not found in inventory' };
  }
  
  const currentQuantity = inventoryItems[0].quantity;
  if (currentQuantity < orderPart.quantity) {
    return { error: 'Not enough items in inventory' };
  }
  
  // Reduce inventory quantity
  await query(
    'UPDATE inventory SET quantity = quantity - ? WHERE item_id = ?',
    [orderPart.quantity, orderPart.item_id]
  );
  
  // Add part to order
  const result = await query(
    'INSERT INTO order_parts (order_id, item_id, quantity, price_per_unit) VALUES (?, ?, ?, ?)',
    [
      orderPart.order_id,
      orderPart.item_id,
      orderPart.quantity,
      orderPart.price_per_unit
    ]
  ) as ResultSetHeader;
  
  // Update total cost of the work order
  await updateWorkOrderTotalCost(orderPart.order_id);
  
  return { ...orderPart, order_part_id: result.insertId };
}

export async function removePartFromOrder(orderPartId: number) {
  // Get the part information before deleting
  const orderParts = await query('SELECT order_id, item_id, quantity FROM order_parts WHERE order_part_id = ?', [orderPartId]) as RowDataPacket[];
  if (orderParts.length === 0) {
    return { message: 'Order part not found' };
  }
  
  const { order_id, item_id, quantity } = orderParts[0];
  
  // Return parts to inventory
  await query(
    'UPDATE inventory SET quantity = quantity + ? WHERE item_id = ?',
    [quantity, item_id]
  );
  
  // Delete the part from order
  await query('DELETE FROM order_parts WHERE order_part_id = ?', [orderPartId]);
  
  // Update total cost of the work order
  await updateWorkOrderTotalCost(order_id);
  
  return { message: 'Part removed from order' };
}
