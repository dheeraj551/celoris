// IndexedDB persistent storage for files transferred between pages (e.g. from /open-psd-online to /photolite)
// Handles large PSD, PSB, and image files without hitting localStorage / URL size caps.

const DB_NAME = 'PhotoLiteDB';
const STORE_NAME = 'pending_files';
const KEY = 'active_upload';

export async function storePendingFile(file: File): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) return;

  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(file, KEY);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      };
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
}

export async function retrieveAndClearPendingFile(): Promise<File | null> {
  if (typeof window === 'undefined' || !window.indexedDB) return null;

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.close();
          resolve(null);
          return;
        }
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(KEY);
        getReq.onsuccess = () => {
          const result = getReq.result;
          if (result) {
            store.delete(KEY);
            tx.oncomplete = () => {
              db.close();
              resolve(result instanceof File ? result : null);
            };
          } else {
            db.close();
            resolve(null);
          }
        };
        getReq.onerror = () => {
          db.close();
          resolve(null);
        };
      };
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}
