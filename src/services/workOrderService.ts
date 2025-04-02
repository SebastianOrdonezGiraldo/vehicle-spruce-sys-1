
import { query } from './dbService';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { updateWorkOrderTotalCost } from './workOrderCostService';

export type WorkOrder = {
  order_id?: number;
  vehicle_id: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  start_date?: Date;
  completion_date?: Date;
  total_cost?: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
};

export async function getAllWorkOrders() {
  return query(`
    SELECT wo.*, v.make, v.model, v.license_plate, c.name as customer_name
    FROM work_orders wo
    JOIN vehicles v ON wo.vehicle_id = v.vehicle_id
    JOIN customers c ON v.customer_id = c.customer_id
    ORDER BY wo.created_at DESC
  `);
}

export async function getWorkOrderById(id: number) {
  const workOrder = await query(`
    SELECT wo.*, v.make, v.model, v.license_plate, c.name as customer_name,
           v.customer_id, v.color, v.year
    FROM work_orders wo
    JOIN vehicles v ON wo.vehicle_id = v.vehicle_id
    JOIN customers c ON v.customer_id = c.customer_id
    WHERE wo.order_id = ?
  `, [id]) as RowDataPacket[];
  
  if (workOrder.length === 0) {
    return null;
  }
  
  // Get services for this work order
  const services = await query(`
    SELECT os.*, s.name, s.description, s.estimated_hours, sc.name as category_name
    FROM order_services os
    JOIN services s ON os.service_id = s.service_id
    LEFT JOIN service_categories sc ON s.category_id = sc.category_id
    WHERE os.order_id = ?
  `, [id]);
  
  // Get parts for this work order
  const parts = await query(`
    SELECT op.*, i.name, i.description
    FROM order_parts op
    JOIN inventory i ON op.item_id = i.item_id
    WHERE op.order_id = ?
  `, [id]);
  
  return {
    ...workOrder[0],
    services,
    parts
  };
}

export async function getWorkOrdersByStatus(status: WorkOrder['status']) {
  return query(`
    SELECT wo.*, v.make, v.model, v.license_plate, c.name as customer_name
    FROM work_orders wo
    JOIN vehicles v ON wo.vehicle_id = v.vehicle_id
    JOIN customers c ON v.customer_id = c.customer_id
    WHERE wo.status = ?
    ORDER BY wo.created_at DESC
  `, [status]);
}

export async function getWorkOrdersByVehicle(vehicleId: number) {
  return query(`
    SELECT wo.*, 
           GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') as service_names
    FROM work_orders wo
    LEFT JOIN order_services os ON wo.order_id = os.order_id
    LEFT JOIN services s ON os.service_id = s.service_id
    WHERE wo.vehicle_id = ?
    GROUP BY wo.order_id
    ORDER BY wo.start_date DESC
  `, [vehicleId]);
}

export async function createWorkOrder(workOrder: WorkOrder) {
  const result = await query(
    'INSERT INTO work_orders (vehicle_id, status, start_date, completion_date, total_cost, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [
      workOrder.vehicle_id,
      workOrder.status,
      workOrder.start_date,
      workOrder.completion_date,
      workOrder.total_cost,
      workOrder.notes
    ]
  ) as ResultSetHeader;
  
  return { ...workOrder, order_id: result.insertId };
}

export async function updateWorkOrder(id: number, workOrder: Partial<WorkOrder>) {
  const fieldsToUpdate = Object.keys(workOrder)
    .filter(key => key !== 'order_id' && key !== 'created_at')
    .map(key => `${key} = ?`);
  
  const valuesToUpdate = Object.keys(workOrder)
    .filter(key => key !== 'order_id' && key !== 'created_at')
    .map(key => workOrder[key as keyof WorkOrder]);

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE work_orders SET ${fieldsToUpdate.join(', ')} WHERE order_id = ?`,
    [...valuesToUpdate, id]
  );
  
  return getWorkOrderById(id);
}

export async function updateWorkOrderStatus(id: number, status: WorkOrder['status']) {
  await query(
    'UPDATE work_orders SET status = ? WHERE order_id = ?',
    [status, id]
  );
  
  return getWorkOrderById(id);
}

export async function deleteWorkOrder(id: number) {
  // Delete the work order and related items will be handled by ON DELETE CASCADE
  return query('DELETE FROM work_orders WHERE order_id = ?', [id]);
}
