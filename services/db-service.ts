import { SQLiteDatabase, enablePromise, openDatabase } from 'react-native-sqlite-storage';
import menuData from '../assets/data/menu.json';

enablePromise(true);
const databaseName = 'CanteenDB';

export const getDBConnection = async () => {
  return openDatabase(
    { name: `${databaseName}` },
    () => console.log('Database open success'),
    (err) => console.error('Database open error:', err)
  );
};

export const createTableMenu = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY,
    category TEXT,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT
  )`;
  await db.executeSql(query);
};

export const clearMenuTable = async (db: SQLiteDatabase) => {
  await db.executeSql('DELETE FROM menu');
};

export const insertMenuItems = async (db: SQLiteDatabase, items: any[]) => {
  const insertQuery = `INSERT INTO menu (id, category, name, description, price, image) VALUES (?, ?, ?, ?, ?, ?)`;
  for (const item of items) {
    await db.executeSql(insertQuery, [
      item.id,
      item.category,
      item.name,
      item.description || '',
      item.price,
      item.imageKey || ''
    ]);
  }
};

export const initializeMenuData = async (db: SQLiteDatabase) => {
  for (const item of menuData) {
    const result = await db.executeSql(
      `SELECT COUNT(*) as count FROM menu WHERE name = ?`,
      [item.name]
    );
    const exists = result[0].rows.item(0).count > 0;

    if (!exists) {
      await db.executeSql(
        `INSERT INTO menu (category, name, description, price, image) VALUES (?, ?, ?, ?, ?)`,
        [item.category, item.name, item.description, item.price, item.image]
      );
    }
  }
};

export const getMenuItems = async (db: SQLiteDatabase) => {
  const menuItems = [];
  const results = await db.executeSql(`SELECT * FROM menu ORDER BY category, name`);
  results.forEach(result => {
    result.rows.raw().forEach(item => menuItems.push(item));
  });
  return menuItems;
};

export const getMenuItemById = async (db: SQLiteDatabase, id: number) => {
  const results = await db.executeSql(`SELECT * FROM menu WHERE id = ?`, [id]);
  return results[0].rows.item(0);
};

export const createMenuItem = async (db: SQLiteDatabase, item) => {
  const { category, name, description, price, image } = item;
  await db.executeSql(
    `INSERT INTO menu (category, name, description, price, image) VALUES (?, ?, ?, ?, ?)`,
    [category, name, description, price, image]
  );
};

export const updateMenuItem = async (db: SQLiteDatabase, item) => {
  const { id, category, name, description, price, image } = item;
  await db.executeSql(
    `UPDATE menu SET category = ?, name = ?, description = ?, price = ?, image = ? WHERE id = ?`,
    [category, name, description, price, image, id]
  );
};

export const deleteMenuItem = async (db: SQLiteDatabase, id: number) => {
  await db.executeSql(`DELETE FROM menu WHERE id = ?`, [id]);
};
