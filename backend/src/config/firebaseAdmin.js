import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

// configuracion __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// declara variable de firestore y auth
let _db = null;
let _auth = null;

//inicializa firebase admin
function initializeFirebaseAdmin() {
  try {
    const serviceAccountPath = join(__dirname, './serviceAccountKey.json'); // depende donde esta serviceAccountKey.json
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // inicializar Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    // initialize Firestore and Auth
    _db = admin.firestore();
    _auth = admin.auth();
    
    console.log('Firestore y Auth han sido inicializados correctamente');
    return true;
  } catch (error) {
    console.error('Firebase Admin no ha sido inicializados in correctamente:', error);
    return false;
  }
}

const initialized = initializeFirebaseAdmin();

if (!initialized) {
  _db = null;
  _auth = null;
}

export const db = _db;
export const auth = _auth;
export const isInitialized = initialized;