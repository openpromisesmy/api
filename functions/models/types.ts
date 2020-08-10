import admin = require('firebase-admin');

export type RefHead =
  | admin.firestore.CollectionReference
  | admin.firestore.Query;
