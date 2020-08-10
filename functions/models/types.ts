import admin = require('firebase-admin');

export type RefHead =
  | admin.firestore.CollectionReference
  | admin.firestore.Query;

export type AddReturn = { id: string };

export type ModelError = { status: number; message: string };
