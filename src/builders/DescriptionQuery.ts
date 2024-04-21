import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Description } from '@/types';

export class DescriptionQuery extends QueryBuilder<Description> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.descriptions });
  }
}
