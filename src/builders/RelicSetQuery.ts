import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { RelicSet } from '@/types';

export class RelicSetQuery extends QueryBuilder<RelicSet> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.relicSets });
  }
}
