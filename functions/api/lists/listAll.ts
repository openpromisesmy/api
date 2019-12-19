import express from 'express';
import ListModel from '../../models/list';

async function list(req: express.Request, res: express.Response) {
  try {
    // TODO: check that there's admin scope
    console.log('list all');
    console.log({ queryInListAll: req.query });
    const docs = await ListModel().list(req.query);

    return res.json(docs);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export default list;
