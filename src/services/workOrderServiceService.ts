
import { query } from './dbService';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { updateWorkOrderTotalCost } from './workOrderCostService';

export type OrderService = {
  order_service_id?: number;
  order_id: number;
  service_id: number;
  price: number;
  notes?: string;
};

export async function addServiceToOrder(orderService: OrderService) {
  const result = await query(
    'INSERT INTO order_services (order_id, service_id, price, notes) VALUES (?, ?, ?, ?)',
    [
      orderService.order_id,
      orderService.service_id,
      orderService.price,
      orderService.notes
    ]
  ) as ResultSetHeader;
  
  // Update total cost of the work order
  await updateWorkOrderTotalCost(orderService.order_id);
  
  return { ...orderService, order_service_id: result.insertId };
}

export async function removeServiceFromOrder(orderServiceId: number) {
  // Get the order_id before deleting
  const orderServices = await query('SELECT order_id FROM order_services WHERE order_service_id = ?', [orderServiceId]) as RowDataPacket[];
  if (orderServices.length === 0) {
    return { message: 'Order service not found' };
  }
  
  const orderId = orderServices[0].order_id;
  
  // Delete the service
  await query('DELETE FROM order_services WHERE order_service_id = ?', [orderServiceId]);
  
  // Update total cost of the work order
  await updateWorkOrderTotalCost(orderId);
  
  return { message: 'Service removed from order' };
}
