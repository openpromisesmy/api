import express from 'express';
import ListModel from '../../models/list';

async function get(req: express.Request, res: express.Response) {
  try {
    if (!req.params.id) {
      throw new Error(
        'Expected the :id param to be present.' +
          'Please make sure the route is correct.'
      );
    }

    const { id } = req.params;
    const doc = await ListModel().get(id);

    if (!doc) return res.sendStatus(404);

    res.json(doc);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export default get;
