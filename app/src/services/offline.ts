// ============================================================
// BCH CRM - Offline-First Caching with IndexedDB
// ============================================================

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'bch-crm-offline';
const DB_VERSION = 1;

interface PendingAction {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: number;
}

let db: IDBPDatabase | null = null;

export async function initOfflineDB(): Promise<IDBPDatabase> {
  if (db) return db;

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Cache stores for each table
      if (!database.objectStoreNames.contains('leads')) {
        database.createObjectStore('leads', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('calls')) {
        database.createObjectStore('calls', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('walkins')) {
        database.createObjectStore('walkins', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('followups')) {
        database.createObjectStore('followups', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('callbacks')) {
        database.createObjectStore('callbacks', { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains('users')) {
        database.createObjectStore('users', { keyPath: 'id' });
      }
      // Pending actions queue for sync
      if (!database.objectStoreNames.contains('pending_actions')) {
        const store = database.createObjectStore('pending_actions', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp');
      }
      // Metadata store
      if (!database.objectStoreNames.contains('meta')) {
        database.createObjectStore('meta', { keyPath: 'key' });
      }
    },
  });

  return db;
}

// ---- Cache Operations ----

export async function cacheData<T extends { id: string }>(
  storeName: string,
  items: T[]
): Promise<void> {
  const database = await initOfflineDB();
  const tx = database.transaction(storeName, 'readwrite');
  for (const item of items) {
    await tx.store.put(item);
  }
  await tx.done;

  // Update last sync time
  const metaTx = database.transaction('meta', 'readwrite');
  await metaTx.store.put({ key: `${storeName}_last_sync`, value: Date.now() });
  await metaTx.done;
}

export async function getCachedData<T>(storeName: string): Promise<T[]> {
  const database = await initOfflineDB();
  return database.getAll(storeName) as Promise<T[]>;
}

export async function getCachedItem<T>(storeName: string, id: string): Promise<T | undefined> {
  const database = await initOfflineDB();
  return database.get(storeName, id) as Promise<T | undefined>;
}

export async function removeCachedItem(storeName: string, id: string): Promise<void> {
  const database = await initOfflineDB();
  await database.delete(storeName, id);
}

// ---- Pending Actions Queue (for offline writes) ----

export async function queueAction(
  table: string,
  action: 'insert' | 'update' | 'delete',
  data: Record<string, unknown>
): Promise<void> {
  const database = await initOfflineDB();
  const pending: PendingAction = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    table,
    action,
    data,
    timestamp: Date.now(),
  };
  await database.put('pending_actions', pending);
}

export async function getPendingActions(): Promise<PendingAction[]> {
  const database = await initOfflineDB();
  return database.getAllFromIndex('pending_actions', 'timestamp');
}

export async function removePendingAction(id: string): Promise<void> {
  const database = await initOfflineDB();
  await database.delete('pending_actions', id);
}

export async function getPendingCount(): Promise<number> {
  const database = await initOfflineDB();
  return database.count('pending_actions');
}

// ---- Sync Status ----

export async function getLastSyncTime(storeName: string): Promise<number | null> {
  const database = await initOfflineDB();
  const meta = await database.get('meta', `${storeName}_last_sync`);
  return meta?.value ?? null;
}

export async function clearAllCache(): Promise<void> {
  const database = await initOfflineDB();
  const storeNames = ['leads', 'calls', 'walkins', 'followups', 'callbacks', 'users', 'pending_actions', 'meta'];
  for (const name of storeNames) {
    const tx = database.transaction(name, 'readwrite');
    await tx.store.clear();
    await tx.done;
  }
}
