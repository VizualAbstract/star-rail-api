import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Property } from '@/types';

export class PropertyQuery extends QueryBuilder<Property> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.properties });
  }
}
