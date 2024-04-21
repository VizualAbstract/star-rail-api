import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Element } from '@/types';

export class ElementQuery extends QueryBuilder<Element> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.elements });
  }
}
