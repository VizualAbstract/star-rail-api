import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { RelicMainAffix } from '@/types';

export class RelicMainAffixQuery extends QueryBuilder<RelicMainAffix> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.relicMainAffixes });
  }
}
