import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { LightConePromotion } from '@/types';

export class LightConePromotionQuery extends QueryBuilder<LightConePromotion> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.lightConePromotions });
  }
}
