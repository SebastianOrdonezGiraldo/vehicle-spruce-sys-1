
import { query } from './dbService';
import { RowDataPacket } from 'mysql2';

// Helper function to update the total cost of a work order
export async function updateWorkOrderTotalCost(orderId: number) {
  // Calculate the total from services
  const serviceResults = await query(
    'SELECT SUM(price) as service_total FROM order_services WHERE order_id = ?',
    [orderId]
  ) as RowDataPacket[];
  
  // Calculate the total from parts
  const partResults = await query(
    'SELECT SUM(quantity * price_per_unit) as part_total FROM order_parts WHERE order_id = ?',
    [orderId]
  ) as RowDataPacket[];
  
  const serviceTotal = serviceResults[0].service_total || 0;
  const partTotal = partResults[0].part_total || 0;
  const totalCost = serviceTotal + partTotal;
  
  // Update the work order
  await query(
    'UPDATE work_orders SET total_cost = ? WHERE order_id = ?',
    [totalCost, orderId]
  );
  
  return totalCost;
}
