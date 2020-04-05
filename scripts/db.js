'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const firebase_admin_1 = __importDefault(require('firebase-admin'));
const google_key_json_1 = __importDefault(
  require('../secrets/google-key.json')
);
firebase_admin_1.default.initializeApp({
  credential: firebase_admin_1.default.credential.cert(
    google_key_json_1.default
  )
});
const db = firebase_admin_1.default.firestore();
db.settings({ timestampsInSnapshots: true });
exports.default = db;
