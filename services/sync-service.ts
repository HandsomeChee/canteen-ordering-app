// services/sync-service.ts
import { getDBConnection, clearMenuTable, insertMenuItems, createTableMenu } from './db-service';
import { fetchMenu } from '../src/api';

// Sync remote menu to local SQLite database
export const syncRemoteMenuToLocal = async () => {
  try {
    const db = await getDBConnection();
    await createTableMenu(db); // Ensure table exists
    const remoteItems = await fetchMenu();
    await clearMenuTable(db); // Clear old data
    await insertMenuItems(db, remoteItems); // Insert new data
    return true;
  } catch (error) {
    console.error('Menu sync failed:', error);
    return false;
  }
};
