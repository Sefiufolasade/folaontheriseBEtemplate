const admin = require('firebase-admin');
const logger = require('./logger');

let firebaseApp;

const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Validate required config
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error('Missing Firebase configuration. Check environment variables.');
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    logger.info('✅ Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    logger.error('Firebase initialization failed:', { error: error.message });
    throw error;
  }
};

/**
 * Verify a Firebase ID token
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken, true);
    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid Firebase token: ${error.message}`);
  }
};

/**
 * Get Firebase user by UID
 * @param {string} uid - Firebase UID
 */
const getFirebaseUser = async (uid) => {
  try {
    return await admin.auth().getUser(uid);
  } catch (error) {
    throw new Error(`Could not fetch Firebase user: ${error.message}`);
  }
};

/**
 * Create custom token for a user
 * @param {string} uid - User UID
 * @param {Object} claims - Additional claims
 */
const createCustomToken = async (uid, claims = {}) => {
  try {
    return await admin.auth().createCustomToken(uid, claims);
  } catch (error) {
    throw new Error(`Could not create custom token: ${error.message}`);
  }
};

/**
 * Set custom user claims (e.g., role)
 * @param {string} uid - Firebase UID
 * @param {Object} claims - Claims to set
 */
const setCustomClaims = async (uid, claims) => {
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    logger.info(`Custom claims set for user ${uid}:`, claims);
  } catch (error) {
    throw new Error(`Could not set custom claims: ${error.message}`);
  }
};

module.exports = {
  initializeFirebase,
  verifyFirebaseToken,
  getFirebaseUser,
  createCustomToken,
  setCustomClaims,
  admin,
};
