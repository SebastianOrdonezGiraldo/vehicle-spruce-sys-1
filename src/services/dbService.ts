import mysql from 'mysql2/promise';
import { dbConfig } from '../config/dbConfig';

// Define un tipo para los valores de parámetros SQL
type SqlParamValue = string | number | boolean | null | Date | Buffer;

// Define los tipos de resultado para coincidir con lo que mysql2 realmente devuelve
type QueryResult = mysql.ResultSetHeader | mysql.RowDataPacket[] | mysql.ResultSetHeader[];

// Crea un pool de conexiones
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función auxiliar para ejecutar consultas SQL
export async function query(sql: string, params: SqlParamValue[] = []): Promise<QueryResult> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as QueryResult;
  } catch (error) {
    console.error('Error en la consulta a la base de datos:', error);
    throw error;
  }
}

// Verifica la conexión a la base de datos
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('Falló la conexión a la base de datos:', error);
    return false;
  }
}

// Funciones de ejemplo para operaciones comunes

// Obtener todos los registros de una tabla
export async function getAll(table: string) {
  return query(`SELECT * FROM ${table}`);
}

// Obtener un registro por id
export async function getById(table: string, idField: string, id: number | string) {
  return query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id]);
}

// Insertar un registro
export async function insert(table: string, data: Record<string, SqlParamValue>) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  return query(sql, values);
}

// Actualizar un registro
export async function update(table: string, idField: string, id: number | string, data: Record<string, SqlParamValue>) {
  const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id];
  
  const sql = `UPDATE ${table} SET ${sets} WHERE ${idField} = ?`;
  return query(sql, values);
}

// Eliminar un registro
export async function remove(table: string, idField: string, id: number | string) {
  return query(`DELETE FROM ${table} WHERE ${idField} = ?`, [id]);
}