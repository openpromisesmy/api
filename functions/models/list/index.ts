import add from './add';
import update from './update';
import get from './get';
import list from './list';
import db from '../../services/db';

export = () => ({
  add: add(db),
  update: update(db),
  get: get(db),
  list: list(db)
});
