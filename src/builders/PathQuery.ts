import QueryBuilder, { Config } from '@/QueryBuilder';
import { Resources } from '@/enum';
import { Path } from '@/types';

export class PathQuery extends QueryBuilder<Path> {
  constructor(config?: Config) {
    super({ ...config, resource: Resources.paths });
  }
}
