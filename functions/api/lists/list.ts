import express from 'express';
import ListModel from '../../models/list';

async function list(req: express.Request, res: express.Response) {
  try {
    const docs = await ListModel().list({});

    res.json(docs);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export default list;
