import * as Factory from 'factory.ts';
import { IList } from '../../../schemas/list';

const factory = Factory.Sync.makeFactory<IList>({
  title: 'public safety',
  live: true,
  promise_ids: ['abc1', 'abc2', 'abc3'],
  contributor_id: '123',
  created_at: '2019-05-11T22:51:25.284Z',
  updated_at: '2019-05-11T22:51:25.284Z'
});

export default factory;
