'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const firebase_admin_1 = __importDefault(require('firebase-admin'));
const util_1 = __importDefault(require('../etc/util'));
const secret_json_1 = __importDefault(require('./secret.json'));
// WARNING
// DANGER!
// THIS SCRIPT WILL UPDATE ALL DOCUMENTS UNDER THE COLLECTION
// USE MINDFULLY
// TO ENABLE, CHANGE acknowledged to true
const acknowledged = false;
if (!acknowledged) {
  throw 'Operation stopped. You have not acknowledged the warning.';
}
firebase_admin_1.default.initializeApp({
  credential: firebase_admin_1.default.credential.cert(secret_json_1.default)
});
const db = firebase_admin_1.default.firestore();
const batch = db.batch();
const collectionName = '';
console.log(`batch writing ${collectionName}`);
let result;
(() =>
  __awaiter(this, void 0, void 0, function*() {
    const snapshot = yield db.collection(collectionName).get();
    result = util_1.default.snapshotToArray(snapshot);
    result.forEach(doc => {
      const ref = db.collection(collectionName).doc(doc.id);
      batch.update(ref, { live: true });
    });
    yield batch.commit();
  }))().catch(e => {
  console.log(e);
});
// IF READING FROM JSON
// const json = require(`./${collectionName}`);
// for (let child in json) {
//   const id = child;
//   const object = json[id];
//   var ref = db.collection(collectionName).doc(id);
//   batch.set(ref, object);
// }
