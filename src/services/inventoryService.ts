
import { query } from './dbService';
import { ResultSetHeader } from 'mysql2';

type InventoryItem = {
  item_id?: number;
  name: string;
  description?: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  reorder_level?: number;
  created_at?: Date;
  updated_at?: Date;
};

export async function getAllInventoryItems() {
  return query('SELECT * FROM inventory ORDER BY name');
}

export async function getInventoryItemById(id: number) {
  const results = await query('SELECT * FROM inventory WHERE item_id = ?', [id]);
  return results[0];
}

export async function getLowStockItems() {
  return query('SELECT * FROM inventory WHERE quantity <= reorder_level ORDER BY quantity ASC');
}

export async function searchInventory(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(
    'SELECT * FROM inventory WHERE name LIKE ? OR description LIKE ?',
    [term, term]
  );
}

export async function createInventoryItem(item: InventoryItem) {
  const result = await query(
    'INSERT INTO inventory (name, description, quantity, cost_price, selling_price, reorder_level) VALUES (?, ?, ?, ?, ?, ?)',
    [
      item.name,
      item.description,
      item.quantity,
      item.cost_price,
      item.selling_price,
      item.reorder_level
    ]
  ) as ResultSetHeader;
  
  return { ...item, item_id: result.insertId };
}

export async function updateInventoryItem(id: number, item: Partial<InventoryItem>) {
  const fieldsToUpdate = Object.keys(item)
    .filter(key => key !== 'item_id' && key !== 'created_at')
    .map(key => `${key} = ?`);
  
  const valuesToUpdate = Object.keys(item)
    .filter(key => key !== 'item_id' && key !== 'created_at')
    .map(key => item[key as keyof InventoryItem]);

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE inventory SET ${fieldsToUpdate.join(', ')} WHERE item_id = ?`,
    [...valuesToUpdate, id]
  );
  
  return getInventoryItemById(id);
}

export async function deleteInventoryItem(id: number) {
  return query('DELETE FROM inventory WHERE item_id = ?', [id]);
}

export async function adjustInventoryQuantity(id: number, adjustment: number) {
  await query(
    'UPDATE inventory SET quantity = quantity + ? WHERE item_id = ?',
    [adjustment, id]
  );
  
  return getInventoryItemById(id);
}
