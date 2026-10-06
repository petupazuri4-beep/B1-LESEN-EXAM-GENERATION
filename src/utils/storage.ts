import { ExamModel } from '../types/exam';
import { INITIAL_EXAMS } from '../data/exams';

const DB_NAME = 'b1_lesen_exam_studio_db';
const DB_VERSION = 1;
const STORE_NAME = 'exams';
const SNAPSHOT_STORE = 'snapshots';
const LOCALSTORAGE_KEY = 'b1_exams_data_v1';

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SNAPSHOT_STORE)) {
        db.createObjectStore(SNAPSHOT_STORE, { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadAllExams(): Promise<ExamModel[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        if (req.result && req.result.length > 0) {
          // Sort by examNumber
          const sorted = [...req.result].sort((a, b) => a.examNumber - b.examNumber);
          resolve(sorted);
        } else {
          // First time initialization: populate seed exams
          saveAllExams(INITIAL_EXAMS).then(() => resolve(INITIAL_EXAMS));
        }
      };
      req.onerror = () => {
        resolve(loadFromLocalStorage());
      };
    });
  } catch {
    return loadFromLocalStorage();
  }
}

function loadFromLocalStorage(): ExamModel[] {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => a.examNumber - b.examNumber);
      }
    }
  } catch (e) {
    console.error('Failed reading localStorage', e);
  }
  return INITIAL_EXAMS;
}

export async function saveExam(exam: ExamModel): Promise<void> {
  // Update timestamp
  const updatedExam: ExamModel = {
    ...exam,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(updatedExam);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback localStorage
    const current = loadFromLocalStorage();
    const idx = current.findIndex(e => e.id === exam.id);
    if (idx >= 0) {
      current[idx] = updatedExam;
    } else {
      current.push(updatedExam);
    }
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(current));
  }
}

export async function saveAllExams(exams: ExamModel[]): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      exams.forEach(exam => store.put(exam));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(exams));
  }
}

export async function resetToDefaultExams(): Promise<ExamModel[]> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      INITIAL_EXAMS.forEach(exam => store.put(exam));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(INITIAL_EXAMS));
  }
  return INITIAL_EXAMS;
}
