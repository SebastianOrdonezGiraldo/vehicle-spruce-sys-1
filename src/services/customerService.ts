
import { query } from './dbService';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

type Customer = {
  customer_id?: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  created_at?: Date;
  updated_at?: Date;
};

export async function getAllCustomers() {
  return query('SELECT * FROM customers ORDER BY name ASC');
}

export async function getCustomerById(id: number) {
  const results = await query('SELECT * FROM customers WHERE customer_id = ?', [id]);
  return results[0];
}

export async function searchCustomers(searchTerm: string) {
  const term = `%${searchTerm}%`;
  return query(
    'SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?',
    [term, term, term]
  );
}

export async function createCustomer(customer: Customer) {
  const result = await query(
    'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [customer.name, customer.email, customer.phone, customer.address]
  ) as ResultSetHeader;
  
  return { ...customer, customer_id: result.insertId };
}

export async function updateCustomer(id: number, customer: Partial<Customer>) {
  const fieldsToUpdate = Object.keys(customer)
    .filter(key => key !== 'customer_id' && key !== 'created_at')
    .map(key => `${key} = ?`);
  
  const valuesToUpdate = Object.keys(customer)
    .filter(key => key !== 'customer_id' && key !== 'created_at')
    .map(key => customer[key as keyof Customer]);

  if (fieldsToUpdate.length === 0) {
    return { message: 'No fields to update' };
  }

  await query(
    `UPDATE customers SET ${fieldsToUpdate.join(', ')} WHERE customer_id = ?`,
    [...valuesToUpdate, id]
  );
  
  return getCustomerById(id);
}

export async function deleteCustomer(id: number) {
  return query('DELETE FROM customers WHERE customer_id = ?', [id]);
}

export async function getCustomerWithVehicles(customerId: number) {
  const customer = await getCustomerById(customerId);
  const vehicles = await query('SELECT * FROM vehicles WHERE customer_id = ?', [customerId]);
  return { ...customer, vehicles };
}
