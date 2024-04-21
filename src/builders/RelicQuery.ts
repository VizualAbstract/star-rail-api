import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Relic } from '@/types';

export class RelicQuery extends QueryBuilder<Relic> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.relics });
  }
}
