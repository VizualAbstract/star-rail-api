import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { RelicSubAffix } from '@/types';

export class RelicSubAffixQuery extends QueryBuilder<RelicSubAffix> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.relicSubAffixes });
  }
}
