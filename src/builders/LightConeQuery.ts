import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { LightCone } from '@/types';

export class LightConeQuery extends QueryBuilder<LightCone> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.lightCones });
  }
}
