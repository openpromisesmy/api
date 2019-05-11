import * as Factory from 'factory.ts';
import { IList } from '../../../schemas/list';

const factory = Factory.Sync.makeFactory<IList>({
  title: 'public safety',
  live: true,
  promise_ids: ['abc1', 'abc2', 'abc3'],
  contributor_id: '123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export default factory;
