import admin = require('firebase-admin');

export type RefHead =
  | admin.firestore.CollectionReference
  | admin.firestore.Query;

export interface IAddReturn {
  id: string;
}

export interface IModelError {
  status: number;
  message: string;
}
