const admin = require('firebase-admin');
const serviceAccount = require('../../credentials/firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
});

module.exports = admin;
