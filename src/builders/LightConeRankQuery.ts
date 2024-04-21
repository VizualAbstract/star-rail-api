import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { LightConeRank } from '@/types';

export class LightConeRankQuery extends QueryBuilder<LightConeRank> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.lightConeRanks });
  }
}
